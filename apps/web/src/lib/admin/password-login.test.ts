import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const src = join(dirname(fileURLToPath(import.meta.url)), "../..");

test("staff password login is enough to open the admin console", () => {
  const middleware = readFileSync(join(src, "middleware.ts"), "utf8");
  const layout = readFileSync(join(src, "app/admin/(console)/layout.tsx"), "utf8");
  const mfaPage = readFileSync(join(src, "app/admin/mfa/page.tsx"), "utf8");
  const challenge = readFileSync(join(src, "app/api/v1/admin/mfa/challenge/route.ts"), "utf8");
  const requirePermission = readFileSync(join(src, "lib/admin/require-permission.ts"), "utf8");

  assert.doesNotMatch(middleware, /mfaPath/);
  assert.match(middleware, /pathname\.startsWith\("\/admin\/mfa"\)/);
  assert.match(layout, /AdminShell/);
  assert.doesNotMatch(layout, /admin\/mfa/);
  assert.match(mfaPage, /redirect\("\/admin"\)/);
  assert.match(challenge, /Admin MFA is paused/);
  assert.doesNotMatch(requirePermission, /Admin session expired/);
});
