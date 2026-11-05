import assert from "node:assert/strict";
import test from "node:test";
import { SMS_CONSENT_TEXT } from "../../content/14days";
import { canSendLeadSms, mergeLeadSmsReceipt } from "./sms-receipt";

const now = "2026-11-04T22:20:00.000Z";
const earlier = "2026-11-04T18:00:00.000Z";
const yes = {
  phone: "+13055550142",
  smsConsent: true,
  smsConsentText: SMS_CONSENT_TEXT.en,
  smsConsentAt: earlier,
};

test("cannot text without phone, tick, copy, and timestamp", () => {
  assert.equal(canSendLeadSms(yes), true);
  assert.equal(canSendLeadSms({ ...yes, phone: null }), false);
  assert.equal(canSendLeadSms({ ...yes, smsConsent: false }), false);
  assert.equal(canSendLeadSms({ ...yes, smsConsentAt: null }), false);
  assert.equal(canSendLeadSms({ ...yes, smsConsentText: null }), false);
});

test("a later email-only submit keeps the SMS receipt", () => {
  const merged = mergeLeadSmsReceipt(
    { phone: null, smsConsent: false, smsConsentText: null },
    yes,
    now,
  );
  assert.deepEqual(merged, yes);
});

test("first opt-in stores the tick, copy, and time", () => {
  const merged = mergeLeadSmsReceipt(
    { phone: "+13055550142", smsConsent: true, smsConsentText: SMS_CONSENT_TEXT.en },
    null,
    now,
  );
  assert.equal(merged.smsConsent, true);
  assert.equal(merged.smsConsentAt, now);
  assert.equal(merged.smsConsentText, SMS_CONSENT_TEXT.en);
  assert.equal(canSendLeadSms(merged), true);
});

test("a second opt-in keeps the original tick time", () => {
  const merged = mergeLeadSmsReceipt(
    { phone: "+13055550142", smsConsent: true, smsConsentText: SMS_CONSENT_TEXT.en },
    yes,
    now,
  );
  assert.equal(merged.smsConsentAt, earlier);
});
