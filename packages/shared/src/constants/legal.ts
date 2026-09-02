import { SKIP_PAYMENTS_FOR_PROMO } from "./pricing";

export const BRAND = "ClaimSaver+";
export const HEADQUARTERS = "Miami, Florida";
export const SITE_HOST = "claimsaverplus.com";
export const SUPPORT_EMAIL = "support@claimsaverplus.com";

/** Bump when ToS or Privacy materially change so clickwrap can be re-collected. */
export const LEGAL_DOCUMENTS_VERSION = "2026-09-04";

/** Florida LLC filed 2026. Use on contracts, receipts, and formal notices. */
export const LEGAL_ENTITY_NAME = "CLAIMSAVERPLUS LLC";
export const LEGAL_ENTITY_DBA = "ClaimSaver+";
export const LEGAL_ENTITY_DISPLAY = "CLAIMSAVERPLUS LLC d/b/a ClaimSaver+";

/** Founder credentials for public footer / trust copy — not representation. */
export const FOUNDER = {
  name: "Miguel A. Fernandez, M.Sc.",
  role: "Founder",
  degree: "M.Sc. Law & Policy",
  licenseClass: "6-20",
  licenseType: "Florida All-Lines Adjuster (6-20)",
  licenseNumber: "G279764",
  dfsLookupUrl: "https://licenseesearch.fldfs.com/",
  /** Published as founder background only — not a service sold on the platform. */
  backgroundHighlights: [
    "Paralegal & litigation experience",
    "M.Sc. Law & Policy",
    "Florida All-Lines Adjuster (6-20)",
  ] as const,
} as const;

export const CHECKOUT_PATH = SKIP_PAYMENTS_FOR_PROMO
  ? "/signup?next=/dashboard"
  : "/checkout-account?next=%2Fpricing";

export const POSITIONING =
  "File your Florida no-fault claim. Keep what’s yours.";

export const TRUST_LINES = [
  "Not a law firm",
  "Flat $500 access",
  "Guided filing—you stay in control",
] as const;

export const FRAUD_NOTICE =
  "Any person who knowingly and with intent to injure, defraud or deceive any insurance company makes a statement of claim containing any false incomplete or misleading information, is guilty of a felony of the third degree.";

export const LEGAL_DISCLAIMER =
  "ClaimSaver+ is a guided claim technology platform. We are not a law firm, not your representative with an insurance company, and we do not provide legal advice, claim evaluation, or negotiation on your behalf. You file your no-fault (PIP) claim using our tools—you are the filer, not ClaimSaver+. The $500 fee is for platform access (guided forms, storage, tracking, reminders, and educational content). We do not guarantee any outcome. For legal advice about your specific situation, consult a licensed Florida attorney.";

export const EDUCATION_FOOTER =
  "ClaimSaver+ is a guided claim platform and does not provide legal advice. This article is general information about Florida PIP, not advice about your case.";

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
