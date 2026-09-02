import { NextRequest } from "next/server";
import { checkoutRequestSchema, PRODUCTS, SKIP_PAYMENTS_FOR_PROMO, stripeProductDescription } from "@claimsaver/shared";
import { getStripe } from "@/lib/stripe/server";
import { jsonErr, jsonOk, requireUser } from "@/lib/supabase/auth";
import { siteUrl } from "@/lib/utils";
import { clientIp, rateLimit, rateLimitResponse } from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { user, response } = await requireUser(req);
  if (response) return response;

  if (SKIP_PAYMENTS_FOR_PROMO) {
    const origin = siteUrl().replace(/\/$/, "");
    return jsonOk({ url: `${origin}/dashboard`, sessionId: null });
  }

  const stripe = getStripe();
  if (!stripe) return jsonErr("Stripe is not configured", 500);

  const limited = await rateLimit(`checkout:${user.id}:${clientIp(req)}`, 8, 10 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);

  const parsed = checkoutRequestSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return jsonErr("Select platform access to continue to checkout.");
  }

  const origin = siteUrl().replace(/\/$/, "");
  const line_items = parsed.data.products.map((code) => {
    const product = PRODUCTS[code];
    return {
      quantity: 1,
      price_data: {
        currency: "usd" as const,
        unit_amount: product.amountCents,
        product_data: {
          name: product.name,
          description: stripeProductDescription(code),
        },
      },
    };
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email ?? undefined,
    client_reference_id: user.id,
    line_items,
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing`,
    metadata: {
      userId: user.id,
      products: parsed.data.products.join(","),
    },
    integration_identifier: "csplus_web_kqmwnxpr",
  });

  return jsonOk({ url: session.url, sessionId: session.id });
}
