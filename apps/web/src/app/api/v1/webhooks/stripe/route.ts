import { NextRequest, NextResponse } from "next/server";
import { analytics } from "@heycatch/sdk";
import { PRODUCTS, isProductCode } from "@claimsaver/shared";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import {
  hasRemainingPaidPlatformPurchase,
  platformAccessActionFromStripeEvent,
} from "@/lib/billing/platform-access";

type Admin = ReturnType<typeof getSupabaseAdmin>;

analytics.init({ projectKey: "hck_pk_mXAe0H2X98dyJTiaEHEXTjjuZKairf4Y" });

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Stripe webhook is not configured" }, { status: 500 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database is not configured" }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const disputeStatus =
    event.type.startsWith("charge.dispute.") && "status" in event.data.object
      ? String((event.data.object as Stripe.Dispute).status || "")
      : null;
  const paymentStatus =
    event.type.startsWith("checkout.session.") && "payment_status" in event.data.object
      ? String((event.data.object as Stripe.Checkout.Session).payment_status || "")
      : null;
  const action = platformAccessActionFromStripeEvent({
    type: event.type,
    paymentStatus,
    disputeStatus,
  });

  if (
    action === "grant" &&
    (event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded")
  ) {
    await fulfillCheckout(admin, event.data.object as Stripe.Checkout.Session);
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    await revokeFromCharge(stripe, admin, charge);
  }

  if (
    event.type === "charge.dispute.created" ||
    event.type === "charge.dispute.updated" ||
    event.type === "charge.dispute.closed"
  ) {
    const dispute = event.data.object as Stripe.Dispute;
    const chargeId = typeof dispute.charge === "string" ? dispute.charge : dispute.charge?.id;
    const located = chargeId ? await userFromChargeId(stripe, admin, chargeId) : { userId: null, sessionId: null };
    await admin.from("billing_disputes").upsert(
      {
        stripe_dispute_id: dispute.id,
        user_id: located.userId,
        amount_cents: dispute.amount,
        reason: dispute.reason || "",
        status: dispute.status || "",
        payload: JSON.parse(JSON.stringify(dispute)) as Record<string, unknown>,
      },
      { onConflict: "stripe_dispute_id" },
    );
    if (action === "revoke" && located.userId) {
      if (located.sessionId) {
        await markSessionPurchasesRefunded(admin, located.sessionId);
      }
      await revokeIfNoPaidPlatform(admin, located.userId);
    }
  }

  return NextResponse.json({ received: true });
}

async function fulfillCheckout(admin: Admin, session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId || session.client_reference_id;
  const products = (session.metadata?.products || "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  if (!userId || session.payment_status !== "paid") return;

  const expectedCents = products
    .filter(isProductCode)
    .reduce((sum, code) => sum + PRODUCTS[code].amountCents, 0);
  const paidCents = typeof session.amount_total === "number" ? session.amount_total : 0;
  if (expectedCents < 1 || paidCents < expectedCents) return;

  for (const code of products) {
    if (!isProductCode(code)) continue;
    const amount = PRODUCTS[code].amountCents;
    await admin.from("purchases").upsert(
      {
        user_id: userId,
        stripe_session_id: `${session.id}:${code}`,
        product_code: code,
        amount_cents: amount,
        status: "paid",
      },
      { onConflict: "stripe_session_id" },
    );
  }
  if (products.includes("platform")) {
    await admin
      .from("profiles")
      .update({ has_platform_access: true, updated_at: new Date().toISOString() })
      .eq("id", userId);
  }
  if (products.includes("notarization")) {
    await admin.from("notarization_orders").insert({
      user_id: userId,
      stripe_session_id: session.id,
      status: "awaiting_fulfillment",
      notes: "Legacy notarization SKU — not offered at checkout. Refund if this line item still charged.",
    });
  }

  const email = session.customer_details?.email ?? undefined;
  const name = session.customer_details?.name ?? undefined;
  const plan = products.includes("platform") ? "platform" : undefined;
  await analytics.setIdentity(userId, {
    ...(email ? { email } : {}),
    ...(name ? { name } : {}),
    ...(plan ? { plan } : {}),
  });
  await analytics.trackEvent(
    "purchase_completed",
    { products: products.filter(isProductCode).join(","), amount_cents: paidCents },
    { userId },
  );
}

async function revokeFromCharge(
  stripe: Stripe,
  admin: Admin,
  charge: Stripe.Charge,
) {
  const paymentIntent =
    typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
  if (!paymentIntent) return;
  const located = await userFromPaymentIntent(stripe, admin, paymentIntent);
  if (located.sessionId) {
    await markSessionPurchasesRefunded(admin, located.sessionId);
  }
  if (located.userId) {
    await revokeIfNoPaidPlatform(admin, located.userId);
  }
}

async function userFromChargeId(
  stripe: Stripe,
  admin: Admin,
  chargeId: string,
): Promise<{ userId: string | null; sessionId: string | null }> {
  try {
    const charge = await stripe.charges.retrieve(chargeId);
    const paymentIntent =
      typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
    if (!paymentIntent) return { userId: null, sessionId: null };
    return userFromPaymentIntent(stripe, admin, paymentIntent);
  } catch {
    return { userId: null, sessionId: null };
  }
}

async function userFromPaymentIntent(
  stripe: Stripe,
  admin: Admin,
  paymentIntent: string,
): Promise<{ userId: string | null; sessionId: string | null }> {
  try {
    const sessions = await stripe.checkout.sessions.list({ payment_intent: paymentIntent, limit: 1 });
    const session = sessions.data[0];
    let userId = session?.metadata?.userId || session?.client_reference_id || null;
    if (!userId && session?.id) {
      const { data: purchase } = await admin
        .from("purchases")
        .select("user_id")
        .ilike("stripe_session_id", `${session.id}%`)
        .maybeSingle();
      userId = purchase?.user_id ?? null;
    }
    return { userId, sessionId: session?.id ?? null };
  } catch {
    return { userId: null, sessionId: null };
  }
}

async function markSessionPurchasesRefunded(admin: Admin, sessionId: string) {
  await admin
    .from("purchases")
    .update({ status: "refunded" })
    .ilike("stripe_session_id", `${sessionId}%`)
    .eq("status", "paid");
}

async function revokeIfNoPaidPlatform(admin: Admin, userId: string) {
  const { data } = await admin
    .from("purchases")
    .select("product_code, status")
    .eq("user_id", userId);
  if (hasRemainingPaidPlatformPurchase(data ?? [])) return;
  await admin
    .from("profiles")
    .update({ has_platform_access: false, updated_at: new Date().toISOString() })
    .eq("id", userId);
}
