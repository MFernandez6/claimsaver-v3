import assert from "node:assert/strict";
import test from "node:test";
import {
  maskEmail,
  maskId,
  maskName,
  maskPhone,
  maskSsn,
  stripMedicalFields,
} from "./mask";

test("maskEmail keeps the domain and hides the local part", () => {
  assert.equal(maskEmail("support@claimsaverplus.com"), "s***@claimsaverplus.com");
  assert.equal(maskEmail("  a@b.co  "), "a***@b.co");
  assert.equal(maskEmail("not-an-email"), "***");
});

test("maskPhone keeps the last four digits only", () => {
  assert.equal(maskPhone("305-555-0199"), "***-***-0199");
  assert.equal(maskPhone("19"), "***");
});

test("maskName initials only", () => {
  assert.equal(maskName("Miguel Fernandez"), "M. F.");
  assert.equal(maskName(""), "***");
});

test("maskId shortens UUIDs", () => {
  assert.equal(maskId("2f1c0a7e-1111-2222-3333-444444444444").startsWith("2f1c0a7e"), true);
  assert.ok(maskId("2f1c0a7e-1111-2222-3333-444444444444").endsWith("…"));
});

test("SSN is never partially revealed", () => {
  assert.equal(maskSsn("123-45-6789"), "");
});

test("stripMedicalFields drops health-looking keys", () => {
  const out = stripMedicalFields({
    email: "a@b.co",
    medical: { note: "hidden" },
    diagnosis: "hidden",
    claim_number: "CS1",
  });
  assert.deepEqual(out, { email: "a@b.co", claim_number: "CS1" });
});
