import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CLAIM_ADMIN_RETIRED_MESSAGE } from "./prohibited";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../app/api/v1/admin");

test("retired claim-JSON and claim-note APIs refuse the old operations", () => {
  const source = readFileSync(join(root, "claims/[id]/route.ts"), "utf8");
  assert.match(source, /CLAIM_ADMIN_RETIRED_MESSAGE/);
  assert.doesNotMatch(source, /from\("claims"\)/);
  assert.doesNotMatch(source, /from\("admin_notes"\)/);
  assert.doesNotMatch(source, /\.insert\(/);
  assert.match(CLAIM_ADMIN_RETIRED_MESSAGE, /not a claimant's filing/i);
});

test("deletion approval schedules a 30-day delay instead of wiping immediately", () => {
  const source = readFileSync(join(root, "deletion-requests/[id]/route.ts"), "utf8");
  assert.match(source, /privacy.deletion.approve/);
  assert.match(source, /hard_delete_after/);
  assert.doesNotMatch(source, /fulfillAccountDeletion/);
});

test("14-day leads list never loads worksheet JSON", () => {
  const source = readFileSync(join(root, "leads/route.ts"), "utf8");
  assert.match(source, /utm_source/);
  assert.doesNotMatch(source, /worksheet/);
  assert.doesNotMatch(source, /claim_number/);
});

test("overview no longer lists unmasked users or claim records", () => {
  const source = readFileSync(join(root, "overview/route.ts"), "utf8");
  assert.match(source, /count: "exact"/);
  assert.doesNotMatch(source, /first_name,last_name/);
  assert.doesNotMatch(source, /claim_number/);
});

test("user search and detail never load worksheet JSON or claim numbers", () => {
  const search = readFileSync(join(root, "users/route.ts"), "utf8");
  const detail = readFileSync(join(root, "users/[id]/route.ts"), "utf8");
  const reveal = readFileSync(join(root, "users/[id]/reveal/route.ts"), "utf8");
  for (const source of [search, detail, reveal]) {
    assert.doesNotMatch(source, /worksheet/);
    assert.doesNotMatch(source, /claim_number/);
    assert.doesNotMatch(source, /admin_notes/);
  }
  assert.match(search, /parseUserQuery/);
  assert.match(detail, /count: "exact"/);
  assert.match(detail, /head: true/);
  assert.match(reveal, /reason/);
});

test("clinic and impersonation routes never select worksheet JSON", () => {
  const clinic = readFileSync(join(root, "clinics/[id]/route.ts"), "utf8");
  const snapshot = readFileSync(join(root, "users/[id]/snapshot/route.ts"), "utf8");
  const pilots = readFileSync(join(root, "pilots/route.ts"), "utf8");
  const patients = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "../../app/api/v1/clinic/patients/route.ts"),
    "utf8",
  );
  const cron = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "../../app/api/cron/retention/route.ts"),
    "utf8",
  );
  const retentionJob = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "run-retention.ts"),
    "utf8",
  );
  for (const source of [clinic, snapshot, pilots, patients, cron, retentionJob]) {
    const code = source
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "")
      .replaceAll("worksheet_step", "");
    assert.doesNotMatch(code, /worksheet/);
    assert.doesNotMatch(source, /claim_number/);
  }
  assert.match(snapshot, /worksheet_step/);
});

test("support tickets do not join claim contents", () => {
  const list = readFileSync(join(root, "tickets/route.ts"), "utf8");
  const one = readFileSync(join(root, "tickets/[id]/route.ts"), "utf8");
  for (const source of [list, one]) {
    assert.doesNotMatch(source, /from\("claims"\)/);
    assert.doesNotMatch(source, /worksheet/);
  }
});
