import type { ArticleKey } from "@/data/learningCenter/keys";
import { ARTICLE_SLUGS } from "@/data/learningCenter/slugs";


/** Unique title/description per Learning Center article — written for assistance queries, not the brand. */
export const ARTICLE_SEO: Record<ArticleKey, { title: string; description: string }> = {
  pipSteps: {
    title: "How to file a PIP claim in Florida",
    description:
      "Overview of Florida no-fault (PIP) paperwork after a car accident: notice, application, medical records, and wage proofs. Self-help education—you stay the filer. Not legal advice.",
  },
  fourteenDay: {
    title: "Florida PIP 14-day rule explained",
    description:
      "After a Florida car crash, initial medical care within 14 days can affect PIP benefits. General information about the treatment window. Not legal advice.",
  },
  needLawyer: {
    title: "Do you need a lawyer for a Florida PIP claim?",
    description:
      "Many PIP-only files can be organized without an attorney. When self-help software may be enough, and when to call a licensed Florida lawyer. Not legal advice.",
  },
  documents: {
    title: "Florida PIP claim documents checklist",
    description:
      "Policy papers, crash report, medical bills, wage proofs, and authorizations often used in a Florida no-fault file. Organizational overview, not a required list.",
  },
  mistakes: {
    title: "Common Florida PIP claim mistakes",
    description:
      "Delayed treatment, incomplete applications, and missing records that often slow a no-fault claim. Practical organization tips. Not legal advice.",
  },
};

export const LEARNING_CENTER_PATHS = Object.values(ARTICLE_SLUGS).map(
  (slug) => `/learning-center/${slug}`,
);
