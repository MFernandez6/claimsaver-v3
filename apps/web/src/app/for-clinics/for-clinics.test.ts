import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const page = readFileSync(join(dir, "page.tsx"), "utf8");
const layout = readFileSync(join(dir, "layout.tsx"), "utf8");

test("for-clinics explains the program and books a demo without internal routing copy", () => {
  assert.match(layout, /"\/for-clinics"/);
  assert.match(page, /href="\/clinic-demo"/);
  assert.doesNotMatch(page, /href="\/enroll/);
  assert.doesNotMatch(page, /linksTitle|linkExplain|linkDemo|linkEnroll/);
  assert.doesNotMatch(layout, /\/enroll/);
});
