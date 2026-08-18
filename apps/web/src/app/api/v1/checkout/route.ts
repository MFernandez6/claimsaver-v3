import { NextRequest } from "next/server";
import { checkoutRequestSchema, PRODUCTS, stripeProductDescription } from "@claimsaver/shared";
import { getStripe } from "@/lib/stripe/server";
import { jsonErr, jsonOk, requireUser } from "@/lib/supabase/auth";
import { siteUrl } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) return jsonErr("Stripe is not configured", 500);

  const { user, response } = await requireUser(req);
  if (response) return response;

  const parsed = checkoutRequestSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return jsonErr("Select at least one product: platform and/or notarization.");
  }

  const origin = req.headers.get("origin") || siteUrl();
  const successPath = parsed.data.successPath || "/success?session_id={CHECKOUT_SESSION_ID}";
  const cancelPath = parsed.data.cancelPath || "/pricing";

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
    success_url: `${origin}${successPath.startsWith("/") ? successPath : `/${successPath}`}`,
    cancel_url: `${origin}${cancelPath.startsWith("/") ? cancelPath : `/${cancelPath}`}`,
    metadata: {
      userId: user.id,
      products: parsed.data.products.join(","),
    },
    integration_identifier: "csplus_web_kqmwnxpr",
  });

  return jsonOk({ url: session.url, sessionId: session.id });
}
