import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const migration = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    "../../../../../supabase/migrations/20261104180000_admin_console_foundation.sql",
  ),
  "utf8",
);

test("migration adds user_roles and maps today's staff flags", () => {
  assert.match(migration, /create type public\.app_role as enum/);
  assert.match(migration, /create table if not exists public\.user_roles/);
  assert.match(migration, /super_admin/);
  assert.match(migration, /'OWNER'::public\.app_role/);
  assert.match(migration, /role = 'admin'/);
});

test("audit_events is append-only at the database", () => {
  assert.match(migration, /create table if not exists public\.audit_events/);
  assert.match(migration, /audit_events is append-only/);
  assert.match(migration, /before update on public\.audit_events/);
  assert.match(migration, /before delete on public\.audit_events/);
  assert.match(migration, /grant select, insert on table public\.audit_events to service_role/);
  assert.doesNotMatch(migration, /grant [^\n]*update[^\n]*audit_events/);
  assert.doesNotMatch(migration, /grant [^\n]*delete[^\n]*audit_events/);
});
