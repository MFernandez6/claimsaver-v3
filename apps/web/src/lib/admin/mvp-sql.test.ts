import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const migration = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    "../../../../../supabase/migrations/20261104190000_admin_console_mvp.sql",
  ),
  "utf8",
);

test("support tickets are service-role only and not a claims table", () => {
  assert.match(migration, /create table if not exists public\.support_tickets/);
  assert.match(migration, /create table if not exists public\.support_messages/);
  assert.match(migration, /enable row level security/);
  assert.match(migration, /revoke all on table public\.support_tickets from public, anon, authenticated/);
  assert.match(migration, /grant select, insert, update, delete on table public\.support_tickets to service_role/);
  assert.doesNotMatch(migration, /claim_id/);
  assert.doesNotMatch(migration, /create table[^\n]*claims/i);
});