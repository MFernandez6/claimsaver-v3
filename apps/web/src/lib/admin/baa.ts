export const CLINIC_PLANS = ["PILOT", "FOUNDING_199", "STANDARD_299"] as const;
export type ClinicPlan = (typeof CLINIC_PLANS)[number];

export const BAA_STATUSES = ["NOT_SENT", "SENT", "SIGNED"] as const;
export type BaaStatus = (typeof BAA_STATUSES)[number];

export function canOpenEnrollment(input: {
  baaStatus: string;
  isActive: boolean;
}): boolean {
  return input.baaStatus === "SIGNED" && input.isActive;
}

export function listedMrrCents(plan: string): number {
  if (plan === "FOUNDING_199") return 19900;
  if (plan === "STANDARD_299") return 29900;
  return 0;
}

export function isOnTrack(updatedAt: string, now = Date.now()): boolean {
  const ts = Date.parse(updatedAt);
  if (!Number.isFinite(ts)) return false;
  return now - ts <= 14 * 24 * 60 * 60 * 1000;
}
