import { PATIENT_PRICE_USD, SUPPORT_EMAIL } from "@claimsaver/shared";
import en from "@/locales/en.json";
import { formatPatientPrice } from "@/lib/copy/pricing";
import { siteUrl } from "@/lib/utils";
import { LAWYER_DECLINED_PATH } from "@/lib/seo/paths";

export { LAWYER_DECLINED_PATH };

function interp(value: string) {
  return value
    .replaceAll("{{price}}", formatPatientPrice("en"))
    .replaceAll("{{supportEmail}}", SUPPORT_EMAIL);
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

const HOME_FAQ_KEYS = [
  "legal",
  "lawFirm",
  "attorneyNeed",
  "vsAttorney",
  "duration",
  "cost",
  "accidents",
  "documents",
  "ifYouStop",
  "refund",
] as const;

export function homeFaqJsonLd() {
  const faq = en.home.faq;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQ_KEYS.map((key) => {
      const item = faq[key];
      let text = interp(item.answer);
      if (key === "cost") {
        text = `${interp(en.copy.patientPrice.short)} ${faq.cost.clinicLink}`;
      }
      if (key === "attorneyNeed") {
        text = `${text} ${en.pages.lawyerDeclined.navLink}`;
      }
      return {
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text },
      };
    }),
  };
}

export function pricingProductJsonLd() {
  const origin = siteUrl().replace(/\/$/, "");
  const price = String(PATIENT_PRICE_USD);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "ClaimSaver+ platform access",
    description: interp(en.copy.patientPrice.short),
    brand: { "@type": "Brand", name: "ClaimSaver+" },
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${origin}/pricing`,
    },
  };
}

export function lawyerDeclinedFaqJsonLd() {
  const copy = en.pages.lawyerDeclined;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (["faq1", "faq2", "faq3", "faq4"] as const).map((key) => ({
      "@type": "Question",
      name: interp(copy[key].question),
      acceptedAnswer: { "@type": "Answer", text: interp(copy[key].answer) },
    })),
  };
}

export function pricingDocumentTitle() {
  return `ClaimSaver+ pricing: flat $${PATIENT_PRICE_USD}, Florida PIP claim software`;
}
