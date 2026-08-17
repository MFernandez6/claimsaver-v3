import { NextRequest, NextResponse } from "next/server";
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
      const admin = getSupabaseAdmin();
      for (const code of products) {
        if (code !== "platform" && code !== "notarization") continue;
        const amount =
          code === "platform" ? 50_000 : 2_500;
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
    }
  }

  return NextResponse.json({ received: true });
}
