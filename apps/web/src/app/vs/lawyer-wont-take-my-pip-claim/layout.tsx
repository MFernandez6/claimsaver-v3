import { JsonLd, lawyerDeclinedFaqJsonLd } from "@/lib/seo/json-ld";
import { LAWYER_DECLINED_PATH } from "@/lib/seo/paths";
import { pageMeta } from "@/lib/page-seo";

export const metadata = pageMeta(
  "Lawyer won't take my PIP claim",
  "PI firms often decline a PIP-only file. You can still file Florida no-fault with your own insurer. Flat-fee software, or call an attorney when the claim is more than paperwork.",
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
