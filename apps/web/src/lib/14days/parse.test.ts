import assert from "node:assert/strict";
import test from "node:test";
import { parseLeadForm } from "./parse";
import { SMS_CONSENT_TEXT } from "../../content/14days";

function form(overrides: Record<string, string> = {}) {
  return {
    firstName: "Alex",
    email: "Alex@ClaimSaverPlus.com",
    phone: "",
    locale: "en",
    ackSelfHelp: "true",
    ...overrides,
  };
}

test("accepts a valid email-only lead and lowercases email", () => {
  const result = parseLeadForm(form());
  assert.equal(result.ok, true);
  if (!result.ok || result.honeypot) throw new Error("expected lead");
  assert.equal(result.data.email, "alex@claimsaverplus.com");
  assert.equal(result.data.phone, null);
  assert.equal(result.data.smsConsent, false);
  assert.equal(result.data.ackSelfHelp, true);
});

test("honeypot looks like success and does not parse a lead", () => {
  const result = parseLeadForm(form({ website: "https://spam.example" }));
  assert.deepEqual(result, { ok: true, honeypot: true });
});

test("requires self-help acknowledgement", () => {
  const result = parseLeadForm(form({ ackSelfHelp: "" }));
  assert.equal(result.ok, false);
  if (result.ok) throw new Error("expected failure");
  assert.match(result.fields?.ackSelfHelp ?? "", /self-help/i);
});

test("phone requires SMS consent and stores the exact consent text", () => {
  const missing = parseLeadForm(form({ phone: "3055551212" }));
  assert.equal(missing.ok, false);

  const ok = parseLeadForm(form({ phone: "3055551212", smsConsent: "true" }));
  assert.equal(ok.ok, true);
  if (!ok.ok || ok.honeypot) throw new Error("expected lead");
  assert.equal(ok.data.phone, "+13055551212");
  assert.equal(ok.data.smsConsent, true);
  assert.equal(ok.data.smsConsentText, SMS_CONSENT_TEXT.en);
});

test("does not leak whether an email already exists", () => {
  const result = parseLeadForm(form());
  assert.equal(JSON.stringify(result).includes("already"), false);
});

test("accepts French as a campaign locale", () => {
  const result = parseLeadForm(form({ locale: "fr" }));
  assert.equal(result.ok, true);
  if (!result.ok || result.honeypot) throw new Error("expected lead");
  assert.equal(result.data.locale, "fr");
});
