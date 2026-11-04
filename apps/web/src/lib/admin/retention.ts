export const DELETION_DELAY_MS = 30 * 24 * 60 * 60 * 1000;
export const LEAD_RETENTION_MS = 24 * 30 * 24 * 60 * 60 * 1000;

/** Counsel must confirm the year count. Default 7. */
export function retentionYears(): number {
  const n = Number(process.env.RETENTION_YEARS ?? "7");
  if (!Number.isFinite(n) || n < 1 || n > 50) return 7;
  return Math.floor(n);
}

export function retentionCutoffIso(now = new Date()): string {
  const years = retentionYears();
  const cutoff = new Date(now.getTime());
  cutoff.setUTCFullYear(cutoff.getUTCFullYear() - years);
  return cutoff.toISOString();
}

export function deletionDueIso(approvedAt = new Date()): string {
  return new Date(approvedAt.getTime() + DELETION_DELAY_MS).toISOString();
}

export function leadCutoffIso(now = new Date()): string {
  return new Date(now.getTime() - LEAD_RETENTION_MS).toISOString();
}
