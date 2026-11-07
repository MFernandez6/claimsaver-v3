import type { Metadata } from "next";
import { PATIENT_PRICE_USD } from "@claimsaver/shared";
import { JsonLd, pricingDocumentTitle, pricingProductJsonLd } from "@/lib/seo/json-ld";

const title = pricingDocumentTitle();
const description = `ClaimSaver+ platform access is a flat $${PATIENT_PRICE_USD}. Self-help Florida PIP software. You stay the filer. Not a law firm.`;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/pricing" },
  openGraph: { title, description },
  twitter: { title, description },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={pricingProductJsonLd()} />
      {children}
    </>
  );
}
