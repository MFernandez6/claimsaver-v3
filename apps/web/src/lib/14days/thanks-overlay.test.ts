import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const src = join(dirname(fileURLToPath(import.meta.url)), "../..");

test("thanks overlay stays on screen; PDF opens only from a tap", () => {
  const overlay = readFileSync(join(src, "components/14days/thanks-overlay.tsx"), "utf8");
  const form = readFileSync(join(src, "components/14days/lead-form.tsx"), "utf8");
  const submit = readFileSync(join(src, "lib/14days/submit.ts"), "utf8");
  const thanks = readFileSync(join(src, "components/14days/landing.tsx"), "utf8");

  assert.match(overlay, /fixed inset-0 z-\[80\]/);
  assert.match(overlay, /aria-modal="true"/);
  assert.match(overlay, /id="lead-open-pdf"/);
  assert.match(overlay, /target="_blank"/);
  assert.doesNotMatch(overlay, /autoOpenPdf/);
  assert.doesNotMatch(overlay, /window\.open/);
  assert.doesNotMatch(overlay, / download/);
  assert.doesNotMatch(form, /openChecklistPdfWindow/);
  assert.doesNotMatch(form, /showChecklistPdf/);
  assert.doesNotMatch(form, /window\.open/);
  assert.match(form, /ThanksOverlay/);
  assert.match(form, /name="smsConsent"/);
  assert.doesNotMatch(form, /showSms/);
  assert.doesNotMatch(thanks, /autoOpenPdf/);
  assert.doesNotMatch(submit, /redirect\(/);
  assert.match(submit, /sendChecklistEmail/);
});
