import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const migration = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    "../../../../../supabase/migrations/20261104200000_admin_console_ops.sql",
  ),
  "utf8",
);

test("ops migration gates clinic activation on a signed BAA", () => {
  assert.match(migration, /create table if not exists public\.clinics/);
  assert.match(migration, /clinics_active_requires_baa/);
  assert.match(migration, /baa_status = 'SIGNED'/);
  assert.doesNotMatch(migration, /^\s*worksheet\b/m);
});

test("impersonation sessions are consented and time-boxed", () => {
  assert.match(migration, /create table if not exists public\.impersonation_sessions/);
  assert.match(migration, /'pending', 'active', 'denied', 'expired', 'ended'/);
});
