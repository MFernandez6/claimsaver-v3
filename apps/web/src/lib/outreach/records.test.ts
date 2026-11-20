import assert from "node:assert/strict";
import test from "node:test";
import { parseOutreachBody, resolveOutreachStage } from "./records.ts";

test("accepts a clinic write and a delete id", () => {
  const saved = parseOutreachBody(
    JSON.stringify({
      id: "clinic-test",
      kind: "clinic",
      title: " Example Clinic ",
      batch: " Kendall ",
      stage: "contacted",
      due: "2026-12-01",
      consentAt: "2026-11-20",
      consentSource: "Verbal",
    }),
    "PUT",
  );
  assert.equal(saved.ok, true);
  if (!saved.ok || !saved.write) return;
  assert.equal(saved.write.fields.title, "Example Clinic");
  assert.equal(saved.write.fields.batch, "Kendall");
  assert.equal(saved.write.stage, "contacted");
  assert.equal(saved.write.nextActionAt, "2026-12-01T12:00:00.000Z");
  assert.equal(saved.write.consentAt, "2026-11-20T12:00:00.000Z");
  assert.equal(saved.write.consentSource, "Verbal");
  assert.equal(saved.write.fields.stage, undefined);

  const removed = parseOutreachBody(JSON.stringify({ id: "clinic-test" }), "DELETE");
  assert.equal(removed.ok, true);
});

test("defaults clinic records without a stage to lead and maps legacy status", () => {
  const fresh = parseOutreachBody(
    JSON.stringify({ id: "clinic-new", kind: "clinic", title: "Palm Grove" }),
    "PUT",
  );
  assert.equal(fresh.ok, true);
  if (!fresh.ok || !fresh.write) return;
  assert.equal(fresh.write.stage, "lead");

  assert.equal(
    resolveOutreachStage({ kind: "clinic", status: "Visit scheduled" }),
    "visit_scheduled",
  );
  const task = parseOutreachBody(
    JSON.stringify({ id: "task-1", kind: "task", title: "Packet", status: "Done" }),
    "PUT",
  );
  assert.equal(task.ok, true);
  if (!task.ok || !task.write) return;
  assert.equal(task.write.stage, null);
});

test("rejects a public-looking or incomplete record", () => {
  assert.equal(parseOutreachBody("{", "PUT").ok, false);
  assert.equal(parseOutreachBody(JSON.stringify({ id: "../secret", kind: "clinic", title: "A" }), "PUT").ok, false);
  assert.equal(parseOutreachBody(JSON.stringify({ id: "ok", kind: "clinic", title: "  " }), "PUT").ok, false);
  assert.equal(parseOutreachBody("x".repeat(16001), "DELETE").ok, false);
  assert.equal(
    parseOutreachBody(JSON.stringify({ id: "ok", kind: "clinic", title: "A", stage: "warm" }), "PUT").ok,
    false,
  );
});
