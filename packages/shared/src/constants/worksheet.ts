export const WORKSHEET_STEPS = [
  { step: 1, title: "How you’ll use this worksheet", key: "method" },
  { step: 2, title: "Application header", key: "header" },
  { step: 3, title: "Claimant identity", key: "identity" },
  { step: 4, title: "Accident", key: "accident" },
  { step: 5, title: "Injury and treatment", key: "injury" },
  { step: 6, title: "Employment, wages, other coverage", key: "wages" },
  { step: 7, title: "Authorizations", key: "authorizations" },
  { step: 8, title: "Review and save", key: "review" },
] as const;

export const TOTAL_WORKSHEET_STEPS = WORKSHEET_STEPS.length;

export const COMPLETION_METHODS = ["digital_worksheet", "paper_hand"] as const;
export type CompletionMethod = (typeof COMPLETION_METHODS)[number] | "";

export const JOURNEY_STEPS = [
  {
    id: 1,
    title: "Enter information",
    required: true,
    note: "Complete the Florida no-fault worksheet.",
  },
  {
    id: 2,
    title: "Organize documents",
    required: true,
    note: "Police report, medical records, insurance card, photos, bills.",
  },
  {
    id: 3,
    title: "Track treatment and expenses",
    required: true,
    note: "Log visits, bills, and wage loss for your own records.",
  },
  {
    id: 4,
    title: "You send the package to your insurer",
    required: true,
    note: "ClaimSaver+ does not file or submit on your behalf.",
  },
  {
    id: 5,
    title: "Stay on deadlines with reminders",
    required: false,
    note: "General templates—not legal advice.",
  },
  {
    id: 6,
    title: "You handle follow-up with the carrier",
    required: false,
    note: "ClaimSaver+ does not negotiate.",
  },
] as const;
