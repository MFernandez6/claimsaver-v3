import Stripe from "stripe";

let client: Stripe | null | undefined;

export function getStripe() {
  if (client !== undefined) return client;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    client = null;
    return client;
  }
  client = new Stripe(key, {
    apiVersion: "2026-07-29.dahlia",
    typescript: true,
  });
  return client;
}
