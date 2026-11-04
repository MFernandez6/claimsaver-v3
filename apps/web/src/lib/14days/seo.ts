import type { Metadata } from "next";
import { getDaysCopy, DAYS_PATH, type DaysLocale } from "@/content/14days";
import { siteUrl } from "@/lib/utils";

export function daysMetadata(locale: DaysLocale): Metadata {
  const copy = getDaysCopy(locale);
  const origin = siteUrl().replace(/\/$/, "");
  const canonical = `${origin}${copy.path}`;
  return {
    title: { absolute: copy.metaTitle },
    description: copy.metaDescription,
    alternates: {
      canonical: copy.path,
      languages: {
        en: DAYS_PATH.en,
        es: DAYS_PATH.es,
        "x-default": DAYS_PATH.en,
      },
    },
    openGraph: {
      title: copy.metaTitle,
      description: copy.metaDescription,
      url: canonical,
      locale: locale === "es" ? "es_US" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: copy.metaTitle,
      description: copy.metaDescription,
    },
  };
}

export function daysFaqJsonLd(locale: DaysLocale) {
  const copy = getDaysCopy(locale);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
