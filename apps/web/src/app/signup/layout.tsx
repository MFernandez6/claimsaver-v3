import { PATIENT_PRICE_USD } from "@claimsaver/shared";
import { pageMeta } from "@/lib/page-seo";

export const metadata = pageMeta(
  "Start a Florida PIP claim",
  `Create an account and pay $${PATIENT_PRICE_USD} for self-help software to file a Florida no-fault (PIP) claim yourself. You stay the filer.`,
  "/signup",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
