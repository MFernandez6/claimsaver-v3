import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const page = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "page.tsx"), "utf8");

test("stale Terms hide the dashboard behind LegalReaccept", () => {
  assert.match(page, /if \(profile\.legalConsentCurrent === false\) \{\s*return;/);
  assert.match(
    page,
    /if \(me\?\.legalConsentCurrent === false\) \{[\s\S]*?<LegalReaccept[\s\S]*?onAccepted=\{\(\) => void refresh\(\)\}/,
  );
  const reacceptReturn = page.indexOf("me?.legalConsentCurrent === false");
  const overview = page.lastIndexOf("<DashboardOverviewPanels");
  const unlock = page.indexOf("dashboard.unlockTitle");
  assert.ok(reacceptReturn >= 0);
  assert.ok(overview > reacceptReturn);
  assert.ok(unlock > reacceptReturn);
});

test("document Open is a same-origin link Safari will not popup-block", () => {
  assert.match(page, /\/api\/v1\/documents\/\$\{d\.id\}\?open=1/);
  assert.doesNotMatch(page, /window\.open\(url/);
  assert.doesNotMatch(page, /location\.assign\(url\)/);
});
