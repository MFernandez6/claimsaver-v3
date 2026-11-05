import assert from "node:assert/strict";
import test from "node:test";
import { resolvePostLoginPath, signedInHome } from "./signed-in-home";

test("OWNER and SUPPORT land in the admin console, not the claimant dashboard", () => {
  assert.deepEqual(signedInHome("OWNER"), {
    href: "/admin",
    labelKey: "navigation.adminConsole",
  });
  assert.deepEqual(signedInHome("SUPPORT"), {
    href: "/admin",
    labelKey: "navigation.adminConsole",
  });
  assert.deepEqual(signedInHome(null), {
    href: "/dashboard",
    labelKey: "navigation.dashboard",
  });
});

test("staff login replaces the default dashboard next path", () => {
  assert.equal(resolvePostLoginPath("/dashboard", "OWNER"), "/admin");
  assert.equal(resolvePostLoginPath("/dashboard?email_confirmed=1", "SUPPORT"), "/admin");
  assert.equal(resolvePostLoginPath("/", "OWNER"), "/admin");
  assert.equal(resolvePostLoginPath("/admin/leads", "OWNER"), "/admin/leads");
  assert.equal(resolvePostLoginPath("/dashboard", null), "/dashboard");
});
