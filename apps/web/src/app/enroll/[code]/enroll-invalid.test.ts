import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const page = readFileSync(join(dir, "page.tsx"), "utf8");
const client = readFileSync(join(dir, "enroll-client.tsx"), "utf8");

test("invalid clinic codes render a dedicated message and skip signup", () => {
  assert.match(page, /EnrollInvalid/);
  assert.match(page, /generateMetadata/);
  assert.match(page, /invited you/);
  assert.doesNotMatch(page, /Create my account/);
  assert.match(client, /pages\.enroll\.createAccount/);
  assert.match(client, /pages\.enroll\.title/);
  assert.match(client, /copy\.patientPrice\.sameForReferrals/);
  assert.match(client, /copy\.clinic\.visibility/);
  assert.match(client, /copy\.disclaimer\.selfHelp/);
  assert.match(client, /document\.title/);
});
