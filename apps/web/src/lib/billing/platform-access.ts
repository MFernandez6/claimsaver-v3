/** Pure Stripe → access decisions. Database writes stay in the webhook route. */

export type PlatformAccessAction = "grant" | "revoke" | "ignore";

export function platformAccessActionFromStripeEvent(input: {
  type: string;
  paymentStatus?: string | null;
  disputeStatus?: string | null;
}): PlatformAccessAction {
  if (
    input.type === "checkout.session.completed" ||
    input.type === "checkout.session.async_payment_succeeded"
  ) {
    return input.paymentStatus === "paid" ? "grant" : "ignore";
  }
  if (input.type === "charge.refunded") return "revoke";
  if (input.type === "charge.dispute.updated" || input.type === "charge.dispute.closed") {
    return input.disputeStatus === "lost" ? "revoke" : "ignore";
  }
  return "ignore";
}

export function hasRemainingPaidPlatformPurchase(
  purchases: Array<{ product_code: string; status: string }>,
): boolean {
  return purchases.some((row) => row.product_code === "platform" && row.status === "paid");
}
