import { PATIENT_PRICE_USD } from "@claimsaver/shared";
import { pageMeta } from "@/lib/page-seo";

export const metadata = pageMeta(
  "Pricing",
  `ClaimSaver+ platform access is a flat $${PATIENT_PRICE_USD}. Self-help Florida PIP software. You stay the filer. Not a law firm.`,
  "/pricing",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
