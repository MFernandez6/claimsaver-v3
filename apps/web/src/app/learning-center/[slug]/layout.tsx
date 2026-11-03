import { EDUCATION_FOOTER } from "@claimsaver/shared";
import { EN_ARTICLE_FAQS } from "@/data/learningCenter/faqs";
import { SLUG_TO_ARTICLE } from "@/data/learningCenter/slugs";

export default async function ArticleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const key = SLUG_TO_ARTICLE[slug];
  if (!key) return children;

  const jsonLd = {
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
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
