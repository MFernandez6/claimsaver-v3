import { PATIENT_PRICE_USD, SKIP_PAYMENTS_FOR_PROMO } from "./pricing";

export const BRAND = "ClaimSaver+";
export const HEADQUARTERS = "Miami, Florida";
/** Principal office on Florida Division of Corporations filing L26000456741. */
export const PRINCIPAL_ADDRESS = {
  streetAddress: "1700 NW North River Drive, Apt. 908",
  addressLocality: "Miami",
  addressRegion: "FL",
  postalCode: "33125",
  addressCountry: "US",
} as const;
export const PRINCIPAL_ADDRESS_LINE = `${PRINCIPAL_ADDRESS.streetAddress}, ${PRINCIPAL_ADDRESS.addressLocality}, ${PRINCIPAL_ADDRESS.addressRegion} ${PRINCIPAL_ADDRESS.postalCode}`;
export const SUNBIZ_DOCUMENT_NUMBER = "L26000456741";
export const SITE_HOST = "claimsaverplus.com";
export const SUPPORT_EMAIL = "support@claimsaverplus.com";

/** Bump when ToS or Privacy materially change so clickwrap can be re-collected. */
export const LEGAL_DOCUMENTS_VERSION = "26.11.05.3";

/** Florida LLC filed 2026. Use on contracts, receipts, and formal notices. */
export const LEGAL_ENTITY_NAME = "CLAIMSAVERPLUS LLC";
export const LEGAL_ENTITY_DBA = "ClaimSaver+";
export const LEGAL_ENTITY_DISPLAY = "CLAIMSAVERPLUS LLC d/b/a ClaimSaver+";

/**
 * Public founder copy only. Do not put a 6-20 / license number on the
 * marketing surface until Florida insurance-regulatory counsel writes on
 * §626.854. The number stays in docs/LAUNCH-CHECKLIST.md for that briefing.
 */
export const FOUNDER = {
  name: "Miguel A. Fernandez, M.Sc.",
  role: "Founder & CEO",
  degree: "M.Sc. Law & Policy",
  backgroundHighlights: [
    "Paralegal & litigation experience",
    "M.Sc. Law & Policy",
  ] as const,
} as const;

/** Public conversion path: show the $499 offer before account creation. */
export const START_PATH = "/pricing";

export const CHECKOUT_PATH = SKIP_PAYMENTS_FOR_PROMO
  ? "/signup?next=/dashboard"
  : "/checkout-account?next=%2Fpricing";

export const POSITIONING =
  "Self-help software for Florida PIP paperwork. You stay the filer.";

export const TRUST_LINES = [
  "Not a law firm",
  `Flat $${PATIENT_PRICE_USD} software access`,
  "Document prep—you stay in control",
] as const;

/** TurboTax-style line. Keep this exact sentence in footer, form, and ToS. */
export const SOFTWARE_NOT_ADVICE =
  "ClaimSaver+ is a self-help document preparation tool. It does not provide legal advice and does not create an attorney-client relationship.";

export const BLACKLINE_SEPARATION =
  "ClaimSaver+ is software sold by CLAIMSAVERPLUS LLC. It is not a licensed adjusting service, and not a paid referral to an attorney or public adjuster.";

/**
 * Versioned constraint for counsel audit. There is no user-facing generative AI
 * in the product today. If AI is added later, enablement requires counsel review
 * of this constant and the matching ToS language.
 */
export const AI_OUTPUT_POLICY_VERSION = "26.09.08";

export const AI_OUTPUT_POLICY =
  "No generative AI (Claude, GPT, or similar) is used in any user-facing ClaimSaver+ flow. Allowed if later enabled, and only after counsel review: (1) populating form fields from answers the user already entered; (2) computing calendar dates from dates the user entered (for example, accident date plus 14 days). Disallowed: claim-strength opinions, settlement or benefit-value estimates, outcome predictions, strategy text (including “if the insurer denies, argue X”), and any output that tells the user what to think or do about their claim. Prompt text and output constraints must be versioned here.";

export const FRAUD_NOTICE =
  "Any person who knowingly and with intent to injure, defraud or deceive any insurance company makes a statement of claim containing any false incomplete or misleading information, is guilty of a felony of the third degree.";

export const LEGAL_DISCLAIMER =
  `ClaimSaver+ is a self-help document preparation tool. It does not provide legal advice and does not create an attorney-client relationship. We are not a law firm, not your representative with an insurance company, and we do not evaluate claims, estimate settlement value, or negotiate on your behalf. You prepare and send your own no-fault (PIP) materials—you are the filer, not ClaimSaver+. The $${PATIENT_PRICE_USD} fee is for software access (guided forms, storage, tracking, reminders, and educational content). We do not guarantee any outcome. For advice about your specific situation, consult a licensed Florida attorney.`;

export const EDUCATION_FOOTER =
  "ClaimSaver+ is a self-help document preparation tool. It does not provide legal advice and does not create an attorney-client relationship. This article is general information about Florida PIP, not advice about your case.";

export const LANGUAGES = ["en", "es", "fr"] as const;
export type LanguageCode = (typeof LANGUAGES)[number];

export const CLAIM_STATUSES = [
  "draft",
  "in_progress",
  "pending",
  "reviewing",
  "approved",
  "rejected",
  "completed",
] as const;
export type ClaimStatus = (typeof CLAIM_STATUSES)[number];

/** Customers may only move a claim between these statuses. Staff workflow values stay admin-only. */
export const CUSTOMER_CLAIM_STATUSES = ["draft", "in_progress"] as const;
export type CustomerClaimStatus = (typeof CUSTOMER_CLAIM_STATUSES)[number];

export const CLAIM_PRIORITIES = ["low", "medium", "high", "urgent"] as const;
export type ClaimPriority = (typeof CLAIM_PRIORITIES)[number];

export const DOCUMENT_TYPES = [
  "medical",
  "legal",
  "insurance",
  "evidence",
  "other",
] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const EVENT_TYPES = [
  "appointment",
  "deadline",
  "follow-up",
  "payment",
  "custom",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const EXPENSE_CATEGORIES = [
  "medical",
  "wage",
  "mileage",
  "other",
] as const;
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const USER_ROLES = ["user", "admin", "super_admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];
