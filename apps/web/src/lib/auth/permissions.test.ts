import assert from "node:assert/strict";
import test from "node:test";
import {
  APP_ROLES,
  PERMISSIONS,
  PROHIBITED_PERMISSIONS,
  can,
  canNever,
  highestRole,
  permissionsFor,
} from "./permissions";

test("OWNER can assign roles and read the overview; SUPPORT cannot assign roles", () => {
  assert.equal(can("OWNER", "roles.assign"), true);
  assert.equal(can("OWNER", "admin.overview"), true);
  assert.equal(can("OWNER", "privacy.deletion.approve"), true);
  assert.equal(can("SUPPORT", "admin.overview"), true);
  assert.equal(can("SUPPORT", "roles.assign"), false);
  assert.equal(can("SUPPORT", "privacy.deletion.approve"), false);
  assert.equal(can("OWNER", "users.disable"), true);
  assert.equal(can("SUPPORT", "users.disable"), false);
  assert.equal(can("SUPPORT", "audit.read"), false);
  assert.equal(can("SUPPORT", "impersonate.breakglass"), true);
  assert.equal(can("SUPPORT", "clinics.manage"), false);
});

test("clinic and claimant roles cannot open the admin console", () => {
  assert.equal(can("CLINIC_ADMIN", "admin.access"), false);
  assert.equal(can("CLINIC_STAFF", "admin.access"), false);
  assert.equal(can("CLAIMANT", "admin.access"), false);
  assert.equal(can(null, "admin.access"), false);
});

test("no role is granted a prohibited claim-operating permission", () => {
  for (const role of APP_ROLES) {
    const granted = new Set(permissionsFor(role));
    for (const denied of PROHIBITED_PERMISSIONS) {
      assert.equal(granted.has(denied as never), false, `${role} must not have ${denied}`);
      assert.equal(canNever(denied), false);
    }
  }
});

test("highestRole prefers OWNER over SUPPORT", () => {
  assert.equal(highestRole(["SUPPORT", "OWNER"]), "OWNER");
  assert.equal(highestRole(["CLAIMANT"]), "CLAIMANT");
  assert.equal(highestRole([]), null);
});

test("permission catalog stays explicit", () => {
  assert.ok(PERMISSIONS.includes("admin.access"));
  assert.ok(PROHIBITED_PERMISSIONS.includes("claims.edit"));
  assert.ok(PROHIBITED_PERMISSIONS.includes("claims.note"));
  assert.ok(PROHIBITED_PERMISSIONS.includes("claims.read_content"));
});
