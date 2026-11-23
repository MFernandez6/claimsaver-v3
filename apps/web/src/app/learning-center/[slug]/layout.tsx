import type { Metadata } from "next";
import { JsonLd, articlePageJsonLd } from "@/lib/seo/json-ld";
import { ARTICLE_SEO } from "@/lib/seo/articles";
import { pageMeta } from "@/lib/page-seo";
import { ARTICLE_SLUGS, SLUG_TO_ARTICLE } from "@/data/learningCenter/slugs";

export function generateStaticParams() {
  return Object.values(ARTICLE_SLUGS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const key = SLUG_TO_ARTICLE[slug];
  if (!key) return {};
  const seo = ARTICLE_SEO[key];
  return {
    ...pageMeta(seo.title, seo.description, `/learning-center/${slug}`),
    title: { absolute: `${seo.title} | ClaimSaver+` },
  };
}

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

  return (
    <>
      {articlePageJsonLd(key, slug).map((data) => (
        <JsonLd key={String((data as { "@type": string })["@type"])} data={data} />
      ))}
      {children}
    </>
  );
}
