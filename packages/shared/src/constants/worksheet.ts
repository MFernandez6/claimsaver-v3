export const WORKSHEET_STEPS = [
  { step: 1, title: "How you’ll use this worksheet", key: "method" },
  { step: 2, title: "Application header", key: "header" },
  { step: 3, title: "Claimant identity", key: "identity" },
  { step: 4, title: "Accident", key: "accident" },
  { step: 5, title: "Injury and treatment", key: "injury" },
  { step: 6, title: "Employment, wages, other coverage", key: "wages" },
  { step: 7, title: "Insurance-file authorization", key: "insuranceAuth" },
  { step: 8, title: "Medical records authorization", key: "medicalAuth" },
  { step: 9, title: "PIP benefits disclosure", key: "pipDisclosure" },
  { step: 10, title: "Review and save", key: "review" },
] as const;

export const TOTAL_WORKSHEET_STEPS = WORKSHEET_STEPS.length;

export const COMPLETION_METHODS = ["digital_worksheet", "paper_hand"] as const;
export type CompletionMethod = (typeof COMPLETION_METHODS)[number] | "";
