import { PATIENT_PRICE_USD } from "@claimsaver/shared";
import { JsonLd, howItWorksHowToJsonLd } from "@/lib/seo/json-ld";
import { pageMeta } from "@/lib/page-seo";

export const metadata = pageMeta(
  "How to file a Florida PIP claim",
  `File a Florida no-fault (PIP) claim yourself: guided worksheet, document vault, and 14-day reminders. You stay the filer. Flat $${PATIENT_PRICE_USD}. Not a law firm.`,
  "/how-it-works",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={howItWorksHowToJsonLd()} />
      {children}
    </>
  );
}
