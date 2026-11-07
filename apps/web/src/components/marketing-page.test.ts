import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const pages = [
  "app/for-clinics/page.tsx",
  "app/when-to-call-an-attorney/page.tsx",
  "app/learning-center/page.tsx",
  "app/license-credentials/page.tsx",
  "app/contact/page.tsx",
  "app/vs/lawyer-wont-take-my-pip-claim/page.tsx",
];

test("company pages share the for-clinics marketing shell", () => {
  for (const rel of pages) {
    const src = readFileSync(join(root, rel), "utf8");
    assert.match(src, /MarketingPage/, rel);
    assert.match(src, /h-12 bg-gradient-to-r from-emerald-600 to-teal-800/, rel);
  }
});
