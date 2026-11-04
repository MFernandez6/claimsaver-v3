import assert from "node:assert/strict";
import test from "node:test";
import { parseUsPhone } from "./phone";

test("empty phone is allowed", () => {
  assert.deepEqual(parseUsPhone(""), { ok: true, value: null });
  assert.deepEqual(parseUsPhone("   "), { ok: true, value: null });
});

test("normalizes US numbers to E.164", () => {
  assert.deepEqual(parseUsPhone("(305) 555-1212"), { ok: true, value: "+13055551212" });
  assert.deepEqual(parseUsPhone("1-305-555-1212"), { ok: true, value: "+13055551212" });
  assert.deepEqual(parseUsPhone("+1 305 555 1212"), { ok: true, value: "+13055551212" });
});

test("rejects invalid numbers", () => {
  assert.equal(parseUsPhone("123").ok, false);
  assert.equal(parseUsPhone("0555551212").ok, false);
  assert.equal(parseUsPhone("999").ok, false);
});
