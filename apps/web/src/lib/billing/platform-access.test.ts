import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CLINIC_ACTIVE_CLAIM_SLOTS,
  CLINIC_STAFF_SEATS,
  INDIVIDUAL_CLAIM_LIMIT,
  atClinicActiveClaimLimit,
  atClinicSeatLimit,
  atIndividualClaimLimit,
} from "@claimsaver/shared";
import {
  hasRemainingPaidPlatformPurchase,
  platformAccessActionFromStripeEvent,
} from "./platform-access";

test("one $499 purchase is one claim workspace", () => {
  assert.equal(INDIVIDUAL_CLAIM_LIMIT, 1);
  assert.equal(atIndividualClaimLimit(0), false);
  assert.equal(atIndividualClaimLimit(1), true);
  assert.equal(atIndividualClaimLimit(4), true);
});

test("clinic dashboard caps are 3 seats and 25 active enrollments", () => {
  assert.equal(CLINIC_STAFF_SEATS, 3);
  assert.equal(CLINIC_ACTIVE_CLAIM_SLOTS, 25);
  assert.equal(atClinicSeatLimit(2), false);
  assert.equal(atClinicSeatLimit(3), true);
  assert.equal(atClinicActiveClaimLimit(25), true);
});

test("paid checkout grants; refunds and lost disputes revoke", () => {
  assert.equal(
    platformAccessActionFromStripeEvent({
      type: "checkout.session.completed",
      paymentStatus: "paid",
    }),
    "grant",
  );
  assert.equal(
    platformAccessActionFromStripeEvent({
      type: "checkout.session.async_payment_succeeded",
      paymentStatus: "paid",
    }),
    "grant",
  );
  assert.equal(
    platformAccessActionFromStripeEvent({
      type: "checkout.session.completed",
      paymentStatus: "unpaid",
    }),
    "ignore",
  );
  assert.equal(platformAccessActionFromStripeEvent({ type: "charge.refunded" }), "revoke");
  assert.equal(
    platformAccessActionFromStripeEvent({
      type: "charge.dispute.updated",
      disputeStatus: "lost",
    }),
    "revoke",
  );
  assert.equal(
    platformAccessActionFromStripeEvent({
      type: "charge.dispute.created",
      disputeStatus: "needs_response",
    }),
    "ignore",
  );
  assert.equal(
    platformAccessActionFromStripeEvent({
      type: "charge.dispute.updated",
      disputeStatus: "won",
    }),
    "ignore",
  );
});

test("a second paid platform purchase keeps access after one refund", () => {
  assert.equal(
    hasRemainingPaidPlatformPurchase([
      { product_code: "platform", status: "refunded" },
      { product_code: "platform", status: "paid" },
    ]),
    true,
  );
  assert.equal(
    hasRemainingPaidPlatformPurchase([{ product_code: "platform", status: "refunded" }]),
    false,
  );
});

test("claims, checkout, enroll, and roles enforce the caps in source", () => {
  const webRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
  const claims = readFileSync(join(webRoot, "app/api/v1/claims/route.ts"), "utf8");
  const checkout = readFileSync(join(webRoot, "app/api/v1/checkout/route.ts"), "utf8");
  const enroll = readFileSync(join(webRoot, "app/api/v1/enroll/[code]/route.ts"), "utf8");
  const roles = readFileSync(join(webRoot, "app/api/v1/admin/roles/route.ts"), "utf8");
  const webhook = readFileSync(join(webRoot, "app/api/v1/webhooks/stripe/route.ts"), "utf8");
  assert.match(claims, /atIndividualClaimLimit/);
  assert.match(checkout, /has_platform_access/);
  assert.match(checkout, /already have platform access/);
  assert.match(enroll, /atClinicActiveClaimLimit/);
  assert.match(roles, /atClinicSeatLimit/);
  assert.match(webhook, /charge\.refunded/);
  assert.match(webhook, /revokeIfNoPaidPlatform/);
});
