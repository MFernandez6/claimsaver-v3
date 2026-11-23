import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";
import { JsonLd, homeFaqJsonLd, softwareApplicationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Page() {
  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={softwareApplicationJsonLd()} />
      <JsonLd data={homeFaqJsonLd()} />
      <HomePage />
    </>
  );
}
