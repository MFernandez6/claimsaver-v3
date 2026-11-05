import { PATIENT_PRICE_USD } from "@claimsaver/shared";
import { pageMeta } from "@/lib/page-seo";

export const metadata = pageMeta(
  "Create your account",
  `Create a ClaimSaver+ account, then pay $${PATIENT_PRICE_USD} for Florida PIP claim software access.`,
  "/signup",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
