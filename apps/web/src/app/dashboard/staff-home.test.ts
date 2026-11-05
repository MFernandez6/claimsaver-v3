import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const layout = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "layout.tsx"), "utf8");
const navbar = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../../components/navbar.tsx"),
  "utf8",
);

test("OWNER/SUPPORT hitting /dashboard are sent to the admin console", () => {
  assert.match(layout, /getStaffRole/);
  assert.match(layout, /if \(role\) redirect\("\/admin"\)/);
});

test("signed-in nav uses the staff-aware home destination", () => {
  assert.match(navbar, /useSignedInHome/);
  assert.match(navbar, /href=\{home\.href\}/);
  assert.match(navbar, /t\(home\.labelKey\)/);
  assert.doesNotMatch(navbar, /href="\/dashboard"/);
});
