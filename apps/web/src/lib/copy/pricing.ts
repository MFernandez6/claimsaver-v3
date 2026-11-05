import { CLINIC_PRICE_USD_MONTHLY, PATIENT_PRICE_USD } from "@claimsaver/shared";

export { CLINIC_PRICE_USD_MONTHLY, PATIENT_PRICE_USD };

/** Counsel approved listing the clinic dashboard price. Set NEXT_PUBLIC_CLINIC_TIER_PUBLIC=false to hide it. */
export const CLINIC_TIER_PUBLIC = process.env.NEXT_PUBLIC_CLINIC_TIER_PUBLIC !== "false";

export function formatPatientPrice(locale?: string): string {
  return localeStartsWithFr(locale) ? `${PATIENT_PRICE_USD} $` : `$${PATIENT_PRICE_USD}`;
}

export function formatClinicPrice(locale?: string): string {
  return localeStartsWithFr(locale)
    ? `${CLINIC_PRICE_USD_MONTHLY} $`
    : `$${CLINIC_PRICE_USD_MONTHLY}`;
}

export function clinicPricingKey() {
  return CLINIC_TIER_PUBLIC ? "copy.clinic.pricingPublic" : "copy.clinic.pricingPilot";
}

function localeStartsWithFr(locale?: string) {
  return (locale || "en").toLowerCase().startsWith("fr");
}
