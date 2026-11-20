import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const migration = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    "../../../../../supabase/migrations/20261120160000_outreach_pipeline_stage.sql",
  ),
  "utf8",
);
const desk = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../../../outreach-desk/desk.js"),
  "utf8",
);

test("outreach migration adds stage, next action, and consent columns", () => {
  assert.match(migration, /add column if not exists stage text/);
  assert.match(migration, /next_action_at/);
  assert.match(migration, /consent_at/);
  assert.match(migration, /demo_completed/);
  assert.match(migration, /kind not in \('clinic', 'client'\) or stage is not null/);
  assert.match(migration, /new\.stage := 'lead'/);
  assert.match(migration, /trg_outreach_default_pipeline_stage/);
});

test("outreach desk uses canonical pipeline stages", () => {
  assert.match(desk, /\['demo_completed','Demo completed'\]/);
  assert.match(desk, /consentAt/);
  assert.match(desk, /pipelineStage/);
  assert.match(desk, /stage:\['Pipeline stage',stages\]/);
});
