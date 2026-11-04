import assert from "node:assert/strict";
import test from "node:test";
import {
  ADMIN_ABSOLUTE_MS,
  ADMIN_IDLE_MS,
  adminSessionState,
  remainingMs,
} from "./admin-session";

test("admin session is ok inside idle and absolute windows", () => {
  const now = 1_000_000_000;
  assert.equal(adminSessionState(now, now, now), "ok");
  assert.equal(adminSessionState(now - ADMIN_IDLE_MS + 1, now, now), "ok");
});

test("idle and absolute expiry are distinct", () => {
  const now = 1_000_000_000;
  assert.equal(adminSessionState(now - ADMIN_IDLE_MS - 1, now, now), "idle");
  assert.equal(adminSessionState(now, now - ADMIN_ABSOLUTE_MS - 1, now), "absolute");
  assert.equal(adminSessionState(0, now, now), "missing");
});

test("remainingMs floors at zero", () => {
  assert.equal(remainingMs(100, 50, 200), 0);
  assert.equal(remainingMs(100, 150, 200), 50);
});
