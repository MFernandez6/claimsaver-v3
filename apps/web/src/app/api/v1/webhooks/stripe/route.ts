import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS, isProductCode } from "@claimsaver/shared";
import { getStripe } from "@/lib/stripe/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import type Stripe from "stripe";

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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId || session.client_reference_id;
    const products = (session.metadata?.products || "")
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    if (userId && session.payment_status === "paid") {
      const expectedCents = products
        .filter(isProductCode)
        .reduce((sum, code) => sum + PRODUCTS[code].amountCents, 0);
      const paidCents = typeof session.amount_total === "number" ? session.amount_total : 0;
      if (expectedCents < 1 || paidCents < expectedCents) {
        return NextResponse.json({ received: true });
      }

      const admin = getSupabaseAdmin();
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
    }
  }

  if (event.type === "charge.dispute.created" || event.type === "charge.dispute.updated") {
    const dispute = event.data.object as Stripe.Dispute;
    const admin = getSupabaseAdmin();
    const chargeId = typeof dispute.charge === "string" ? dispute.charge : dispute.charge?.id;
    let userId: string | null = null;
    if (chargeId) {
      try {
        const charge = await stripe.charges.retrieve(chargeId);
        const paymentIntent =
          typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
        if (paymentIntent) {
          const sessions = await stripe.checkout.sessions.list({ payment_intent: paymentIntent, limit: 1 });
          const session = sessions.data[0];
          userId = session?.metadata?.userId || session?.client_reference_id || null;
          if (!userId && session?.id) {
            const { data: purchase } = await admin
              .from("purchases")
              .select("user_id")
              .ilike("stripe_session_id", `${session.id}%`)
              .maybeSingle();
            userId = purchase?.user_id ?? null;
          }
        }
      } catch {
        /* Keep the dispute row even if we cannot attach a user. */
      }
    }
    await admin.from("billing_disputes").upsert(
      {
        stripe_dispute_id: dispute.id,
        user_id: userId,
        amount_cents: dispute.amount,
        reason: dispute.reason || "",
        status: dispute.status || "",
        payload: JSON.parse(JSON.stringify(dispute)) as Record<string, unknown>,
      },
      { onConflict: "stripe_dispute_id" },
    );
  }

  return NextResponse.json({ received: true });
}
