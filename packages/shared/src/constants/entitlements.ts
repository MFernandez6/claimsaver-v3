/**
 * Server-authoritative software limits. Never accept these from the client.
 * Clinic $299 is staff-dashboard software. Patients still pay PATIENT_PRICE_USD.
 */

/** One $499 purchase unlocks one claim workspace. Extra rows already in the database stay readable; new creates are blocked. */
export const INDIVIDUAL_CLAIM_LIMIT = 1;

/** Clinic dashboard staff seats (CLINIC_ADMIN + CLINIC_STAFF on that clinic). */
export const CLINIC_STAFF_SEATS = 3;

/**
 * Active clinic claim = a current `clinic_enrollments` row.
 * The patient still owns the PIP claim and pays separately. Unenroll (when added)
 * frees the slot. Terminal claim status does not auto-unenroll.
 */
export const CLINIC_ACTIVE_CLAIM_SLOTS = 25;

export const CLINIC_DASHBOARD_FEATURE_IDS = [
  "seats",
  "activeClaims",
  "progress",
  "invite",
  "onboarding",
  "patientWorkspace",
] as const;

export type ClinicDashboardFeatureId = (typeof CLINIC_DASHBOARD_FEATURE_IDS)[number];

export function atIndividualClaimLimit(existingClaimCount: number): boolean {
  return existingClaimCount >= INDIVIDUAL_CLAIM_LIMIT;
}

export function atClinicSeatLimit(staffCount: number): boolean {
  return staffCount >= CLINIC_STAFF_SEATS;
}

export function atClinicActiveClaimLimit(enrollmentCount: number): boolean {
  return enrollmentCount >= CLINIC_ACTIVE_CLAIM_SLOTS;
}
