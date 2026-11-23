import {
  EDUCATION_FOOTER,
  LEGAL_ENTITY_NAME,
  PATIENT_PRICE_USD,
  PRINCIPAL_ADDRESS,
  SUPPORT_EMAIL,
} from "@claimsaver/shared";
import en from "@/locales/en.json";
import { formatPatientPrice } from "@/lib/copy/pricing";
import { siteUrl } from "@/lib/utils";
import { ARTICLE_SEO } from "@/lib/seo/articles";
import { LAWYER_DECLINED_PATH } from "@/lib/seo/paths";
import { EN_ARTICLE_FAQS } from "@/data/learningCenter/faqs";
import type { ArticleKey } from "@/data/learningCenter/keys";

export { LAWYER_DECLINED_PATH };

function origin() {
  return siteUrl().replace(/\/$/, "");
}

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

export function organizationJsonLd() {
  const url = origin();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ClaimSaver+",
    legalName: LEGAL_ENTITY_NAME,
    url,
    email: SUPPORT_EMAIL,
    description:
      "Self-help software for Florida no-fault (PIP) claims. You prepare the paperwork and send it to your insurer. Not a law firm. Not legal advice.",
    logo: `${url}/images/brand/claimsaver-plus-lockup.png`,
    areaServed: { "@type": "AdministrativeArea", name: "Florida" },
    knowsAbout: [
      "Florida PIP",
      "Personal Injury Protection",
      "Florida no-fault insurance",
      "file a PIP claim",
      "car accident paperwork",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: SUPPORT_EMAIL,
      areaServed: "US-FL",
      availableLanguage: ["English", "Spanish", "French"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: PRINCIPAL_ADDRESS.streetAddress,
      addressLocality: PRINCIPAL_ADDRESS.addressLocality,
      addressRegion: PRINCIPAL_ADDRESS.addressRegion,
      postalCode: PRINCIPAL_ADDRESS.postalCode,
      addressCountry: PRINCIPAL_ADDRESS.addressCountry,
    },
  };
}

export function websiteJsonLd() {
  const url = origin();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ClaimSaver+",
    url,
    description:
      "File a Florida PIP claim yourself. Self-help no-fault software: guided forms, document vault, and 14-day reminders.",
    inLanguage: "en-US",
    publisher: { "@type": "Organization", name: "ClaimSaver+", url },
  };
}

export function softwareApplicationJsonLd() {
  const url = origin();
  const price = String(PATIENT_PRICE_USD);
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ClaimSaver+",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Self-help claim software",
    operatingSystem: "Web",
    url,
    description:
      "Self-help software to file a Florida no-fault (PIP) claim yourself: guided worksheets, document vault, and deadline reminders. You stay the filer.",
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${url}/pricing`,
    },
    featureList: [
      "Guided Florida PIP worksheets",
      "Encrypted document vault",
      "14-day treatment reminders",
      "Deadline and appointment calendar",
      "Expense and wage-loss logging",
    ],
  };
}

export function howItWorksHowToJsonLd() {
  const url = origin();
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to file a Florida PIP claim yourself",
    description:
      "Use ClaimSaver+ self-help software to prepare Florida no-fault paperwork. You stay the filer and send the package to your insurer. Not legal advice.",
    url: `${url}/how-it-works`,
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Create your account and pay for access",
        text: `Sign in and complete checkout for flat $${PATIENT_PRICE_USD} platform access.`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Complete the guided PIP worksheet",
        text: "Walk through the Florida no-fault form one section at a time with plain-language prompts.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Upload and organize documents",
        text: "Keep police reports, medical records, photos, and insurance papers in your document vault.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Track deadlines and recovery",
        text: "Use calendars and reminders, including awareness of Florida’s 14-day initial treatment window (general information, not legal advice).",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "You compile and send your claim package",
        text: "Pull your documents together and send them to your insurer yourself. ClaimSaver+ does not submit, negotiate, or speak for you.",
      },
    ],
  };
}

const HOME_FAQ_KEYS = [
  "fileYourself",
  "whatIsPip",
  "fourteenDay",
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
  const url = origin();
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
      url: `${url}/pricing`,
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

export function articlePageJsonLd(key: ArticleKey, slug: string) {
  const url = origin();
  const page = `${url}/learning-center/${slug}`;
  const seo = ARTICLE_SEO[key];
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: seo.title,
      description: seo.description,
      url: page,
      inLanguage: "en-US",
      about: ["Florida PIP", "no-fault insurance", "Personal Injury Protection"],
      author: { "@type": "Organization", name: "ClaimSaver+", url },
      publisher: { "@type": "Organization", name: "ClaimSaver+", url },
      mainEntityOfPage: page,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: url },
        { "@type": "ListItem", position: 2, name: "Florida PIP claim guides", item: `${url}/learning-center` },
        { "@type": "ListItem", position: 3, name: seo.title, item: page },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: EN_ARTICLE_FAQS[key].map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${faq.answer} ${EDUCATION_FOOTER}`,
        },
      })),
    },
  ];
}

export function pricingDocumentTitle() {
  return `Florida PIP software pricing: flat $${PATIENT_PRICE_USD} | ClaimSaver+`;
}
