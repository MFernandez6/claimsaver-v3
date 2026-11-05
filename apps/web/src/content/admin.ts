/** Staff-console copy. Claimant product copy stays in content/*.ts. */

export const ADMIN = {
  productName: "ClaimSaver+",
  principle:
    "Staff manage the software, not a claimant's filing. The claimant remains the filer.",
  searchHint:
    "Search by exact email or user ID. Names and partial matches are not searchable. Results stay masked until you reveal with a reason.",
  ticketBanner:
    "Do not advise on a PIP claim, and do not discuss the substance of a filing. Help with account, billing, or technical issues only.",
  privacyNote:
    "OWNER can schedule deletion from an active admin session. The account is disabled now; personal data is hard-deleted 30 days later. Counsel still reviews retention years.",
  impersonationNote:
    "Support may view an account only after the claimant approves, for 30 minutes, read-only. Silent impersonation is never allowed. Worksheets stay with the claimant.",
  impersonationEmail:
    "ClaimSaver+ Support has asked to view your account to fix a software issue. This does not let anyone change your filing. Approve or deny from your dashboard. Access lasts 30 minutes.",
  clinicsNote:
    "A clinic cannot enroll patients until a BAA is marked SIGNED. Your clinic sees whether a patient started and which worksheet step they are on — never their answers, documents, or medical details.",
  ticketEmailFooter:
    "This message is about your ClaimSaver+ account, billing, or a technical issue. We cannot advise on your PIP claim or the substance of your filing. You remain the filer.",
  claimQuestionMacro: `I can't advise on your PIP claim or the substance of your filing.

ClaimSaver+ is document-preparation software. You remain the filer. If you have a question about a deadline, a form, or what to send your insurer, that has to come from you (or your own lawyer)—not from our team.

I can help with your ClaimSaver+ account, billing, or a technical issue. What do you need there?`,
  revealReasons: [
    { id: "billing_dispute", label: "Billing dispute" },
    { id: "account_lockout", label: "Account lockout" },
    { id: "legal_request", label: "Legal request" },
    { id: "other", label: "Other" },
  ],
  prohibited: [
    "Do not open or edit a claimant's worksheet, documents, or medical details.",
    "Do not write notes, advice, or status onto a specific claim.",
    "Do not message a claimant about the substance of their filing.",
    "Do not broker patients or share data with BLACKLINE / sister companies.",
    "Do not bulk-export personal information.",
    "Do not impersonate a claimant without a consented, audited, read-only session.",
  ],
} as const;

export type RevealReasonId = (typeof ADMIN.revealReasons)[number]["id"];
