import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { can } from "../auth/permissions.ts";
import {
  NINETY_DAY_TARGETS,
  PLANNING_FUNDING_USD,
  closedWonRate,
  collectedRevenueCents,
  conversionRate,
  countStages,
  paidClientCount,
  purchasesSince,
  qualifiedDemoCount,
} from "./kpis.ts";

test("actuals ignore refunds and do not add targets", () => {
  const purchases = [
    { user_id: "a", product_code: "platform", status: "paid", amount_cents: 49900, created_at: "2026-11-01T00:00:00Z" },
    { user_id: "a", product_code: "platform", status: "refunded", amount_cents: 49900, created_at: "2026-11-02T00:00:00Z" },
    { user_id: "b", product_code: "notarization", status: "paid", amount_cents: 2500, created_at: "2026-11-03T00:00:00Z" },
  ];
  assert.equal(collectedRevenueCents(purchases), 49900);
  assert.equal(paidClientCount(purchases), 1);
  assert.equal(purchasesSince(purchases, "2026-11-02T00:00:00Z").length, 2);
  assert.equal(NINETY_DAY_TARGETS.payingIndividuals, 10);
  assert.equal(PLANNING_FUNDING_USD, 25000);
  assert.notEqual(collectedRevenueCents(purchases), NINETY_DAY_TARGETS.payingIndividuals);
});

test("demo and conversion math use current clinic stages only", () => {
  const rows = [
    { kind: "clinic", stage: "demo_completed" as const },
    { kind: "clinic", stage: "converted" as const },
    { kind: "clinic", stage: "lost" as const },
    { kind: "clinic", stage: "lead" as const },
    { kind: "client", stage: "demo_completed" as const },
    { kind: "task", stage: null },
  ];
  assert.equal(qualifiedDemoCount(rows), 2);
  const stages = countStages(rows);
  assert.equal(stages.lead, 1);
  assert.equal(stages.converted, 1);
  assert.equal(conversionRate(1, 4), 0.25);
  assert.equal(closedWonRate(1, 1), 0.5);
  assert.equal(conversionRate(0, 0), null);
});

test("OWNER can open pitch KPIs; SUPPORT cannot", () => {
  assert.equal(can("OWNER", "admin.pitch"), true);
  assert.equal(can("SUPPORT", "admin.pitch"), false);
});

test("KPI route never loads worksheet or claim contents", () => {
  const source = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "../../app/api/v1/admin/kpis/route.ts"),
    "utf8",
  );
  assert.match(source, /admin.pitch/);
  assert.match(source, /from\("purchases"\)/);
  assert.doesNotMatch(source, /worksheet/);
  assert.doesNotMatch(source, /claim_number/);
  assert.doesNotMatch(source, /listedMrrCents/);
});
