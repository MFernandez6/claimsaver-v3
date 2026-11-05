import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const page = readFileSync(join(dir, "page.tsx"), "utf8");
const client = readFileSync(join(dir, "enroll-client.tsx"), "utf8");

test("invalid clinic codes render a dedicated message and skip signup", () => {
  assert.match(page, /This link isn't valid/);
  assert.match(page, /generateMetadata/);
  assert.match(page, /invited you/);
  assert.doesNotMatch(page, /Create my account/);
  assert.match(client, /Create my account/);
  assert.match(client, /clinicName\} invited you/);
  assert.match(client, /document\.title/);
});
