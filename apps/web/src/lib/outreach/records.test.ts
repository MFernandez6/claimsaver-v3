import assert from "node:assert/strict";
import test from "node:test";
import { parseOutreachBody } from "./records.ts";

test("accepts a clinic write and a delete id", () => {
  const saved = parseOutreachBody(
    JSON.stringify({ id: "clinic-test", kind: "clinic", title: " Example Clinic ", batch: " Kendall " }),
    "PUT",
  );
  assert.equal(saved.ok, true);
  if (!saved.ok || !saved.write) return;
  assert.equal(saved.write.fields.title, "Example Clinic");
  assert.equal(saved.write.fields.batch, "Kendall");

  const removed = parseOutreachBody(JSON.stringify({ id: "clinic-test" }), "DELETE");
  assert.equal(removed.ok, true);
});

test("rejects a public-looking or incomplete record", () => {
  assert.equal(parseOutreachBody("{", "PUT").ok, false);
  assert.equal(parseOutreachBody(JSON.stringify({ id: "../secret", kind: "clinic", title: "A" }), "PUT").ok, false);
  assert.equal(parseOutreachBody(JSON.stringify({ id: "ok", kind: "clinic", title: "  " }), "PUT").ok, false);
  assert.equal(parseOutreachBody("x".repeat(16001), "DELETE").ok, false);
});
