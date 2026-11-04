import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  generateSmsCode,
  hashSmsCode,
  hashesMatch,
  maskMfaPhone,
  phoneLast4,
  resolveAdminMfaPhone,
  smsMessage,
} from "./sms-otp";

const migration = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    "../../../../../supabase/migrations/20261104210000_admin_sms_otp.sql",
  ),
  "utf8",
);

test("SMS challenges are hashed and service-role only", () => {
  assert.match(migration, /create table if not exists public\.admin_sms_challenges/);
  assert.match(migration, /code_hash/);
  assert.doesNotMatch(migration, /^\s*code\s+text/m);
  assert.match(migration, /revoke all on table public\.admin_sms_challenges from public, anon, authenticated/);
  assert.match(migration, /grant select, insert, update, delete on table public\.admin_sms_challenges to service_role/);
  assert.doesNotMatch(migration, /worksheet/);
});

test("OWNER MFA phone defaults to the founder number", () => {
  const previous = process.env.ADMIN_MFA_PHONE;
  delete process.env.ADMIN_MFA_PHONE;
  assert.equal(resolveAdminMfaPhone(), "+17864173869");
  assert.equal(maskMfaPhone("+17864173869"), "(***) ***-3869");
  assert.equal(phoneLast4("+17864173869"), "3869");
  if (previous === undefined) delete process.env.ADMIN_MFA_PHONE;
  else process.env.ADMIN_MFA_PHONE = previous;
});

test("codes hash stably and compare in constant time", () => {
  const a = hashSmsCode("user-1", "123456");
  const b = hashSmsCode("user-1", "123456");
  const c = hashSmsCode("user-1", "000000");
  assert.equal(a, b);
  assert.equal(hashesMatch(a, b), true);
  assert.equal(hashesMatch(a, c), false);
});

test("generated codes are six digits and the SMS body does not mention a claim", () => {
  const code = generateSmsCode();
  assert.match(code, /^\d{6}$/);
  const body = smsMessage("123456");
  assert.match(body, /123456/);
  assert.doesNotMatch(body, /worksheet|PIP claim/i);
});
