import type { OutreachStage } from "../outreach/records";
import { DEMO_REACHED_STAGES, OUTREACH_STAGES } from "../outreach/records";

/** Labeled 90-day operating targets. Never mix these into actuals. */
export const NINETY_DAY_TARGETS = {
  payingIndividuals: 10,
  payingClinicSubscriptions: 5,
  qualifiedDemos: 20,
} as const;

/** Pitch-planning figure only. Not an announced or committed round. */
export const PLANNING_FUNDING_USD = 25_000;

export const PITCH_TAGLINE = "Your claim. Your control. Our tools.";

export type PurchaseRow = {
  user_id: string;
  product_code: string;
  status: string;
  amount_cents: number;
  created_at?: string;
};

export type PipelineRow = {
  kind: string;
  stage: OutreachStage | null;
};

export function emptyStageCounts(): Record<OutreachStage, number> {
  return Object.fromEntries(OUTREACH_STAGES.map((stage) => [stage, 0])) as Record<
    OutreachStage,
    number
  >;
}

export function collectedRevenueCents(purchases: PurchaseRow[]): number {
  return purchases
    .filter((row) => row.product_code === "platform" && row.status === "paid")
    .reduce((sum, row) => sum + (Number.isFinite(row.amount_cents) ? row.amount_cents : 0), 0);
}

export function paidClientCount(purchases: PurchaseRow[]): number {
  const ids = new Set<string>();
  for (const row of purchases) {
    if (row.product_code === "platform" && row.status === "paid" && row.user_id) {
      ids.add(row.user_id);
    }
  }
  return ids.size;
}

export function purchasesSince(purchases: PurchaseRow[], iso: string): PurchaseRow[] {
  const start = Date.parse(iso);
  if (!Number.isFinite(start)) return [];
  return purchases.filter((row) => Date.parse(String(row.created_at ?? "")) >= start);
}

export function countStages(rows: PipelineRow[]): Record<OutreachStage, number> {
  const counts = emptyStageCounts();
  for (const row of rows) {
    if (row.kind !== "clinic" && row.kind !== "client") continue;
    if (!row.stage) continue;
    counts[row.stage] += 1;
  }
  return counts;
}

export function qualifiedDemoCount(rows: PipelineRow[]): number {
  const reached = new Set<string>(DEMO_REACHED_STAGES);
  return rows.filter((row) => row.kind === "clinic" && row.stage && reached.has(row.stage)).length;
}

export function conversionRate(converted: number, total: number): number | null {
  if (total < 1) return null;
  return converted / total;
}

export function closedWonRate(converted: number, lost: number): number | null {
  const closed = converted + lost;
  if (closed < 1) return null;
  return converted / closed;
}

export function daysAgoIso(days: number, now = Date.now()): string {
  return new Date(now - days * 24 * 60 * 60 * 1000).toISOString();
}
