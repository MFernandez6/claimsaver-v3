import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CLINIC_PLANS } from "./baa";

const migration = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    "../../../../../supabase/migrations/20261120153000_remove_founding_plan.sql",
  ),
  "utf8",
);

test("founding $199 plan is removed from writable clinic plans", () => {
  assert.deepEqual([...CLINIC_PLANS], ["PILOT", "STANDARD_299"]);
  assert.match(migration, /FOUNDING_199/);
  assert.match(migration, /STANDARD_299/);
  assert.match(migration, /check \(plan in \('PILOT', 'STANDARD_299'\)\)/);
});
