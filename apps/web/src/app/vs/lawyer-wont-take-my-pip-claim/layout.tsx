import { JsonLd, lawyerDeclinedFaqJsonLd } from "@/lib/seo/json-ld";
import { LAWYER_DECLINED_PATH } from "@/lib/seo/paths";
import { pageMeta } from "@/lib/page-seo";

export const metadata = pageMeta(
  "Lawyer won't take my PIP claim",
  "A lawyer declined your Florida PIP claim? You can still file no-fault with your own insurer. Self-help software to organize paperwork yourself—or call an attorney when the claim is more than forms.",
  LAWYER_DECLINED_PATH,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={lawyerDeclinedFaqJsonLd()} />
      {children}
    </>
  );
}
