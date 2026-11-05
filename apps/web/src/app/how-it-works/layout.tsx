import { PATIENT_PRICE_USD } from "@claimsaver/shared";
import { pageMeta } from "@/lib/page-seo";

export const metadata = pageMeta(
  "How it works",
  `Guided Florida PIP worksheet, document vault, and deadline reminders. You stay the filer. Flat $${PATIENT_PRICE_USD}. Not a law firm.`,
  "/how-it-works",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
