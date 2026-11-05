import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "admin-shell.tsx"), "utf8");

test("admin console uses a mobile header and drawer instead of a permanent sidebar", () => {
  assert.match(src, /lg:hidden/);
  assert.match(src, /hidden w-64[\s\S]*lg:flex/);
  assert.match(src, /aria-label="Admin sections"/);
  assert.match(src, /Open menu/);
});
