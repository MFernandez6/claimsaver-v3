import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const page = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "page.tsx"), "utf8");

test("homepage exports a canonical URL", () => {
  assert.match(page, /canonical: "\/"/);
  assert.match(page, /export const metadata/);
});
