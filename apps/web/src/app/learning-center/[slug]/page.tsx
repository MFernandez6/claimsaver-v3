"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";
import { getLearningArticleParagraphs } from "@/data/learningCenter";
import { SLUG_TO_ARTICLE } from "@/data/learningCenter/slugs";
import { use } from "react";

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { t, i18n } = useTranslation();
  const key = SLUG_TO_ARTICLE[slug];
  if (!key) notFound();
  const paragraphs = getLearningArticleParagraphs(i18n.language, key);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden pt-28 pb-20">
        <PageHeroBackdrop />
        <article className="relative z-10 mx-auto max-w-3xl px-4">
          <Link href="/learning-center" className="text-sm text-teal-800">← {t("pages.learningCenter.title")}</Link>
          <h1 className="mt-6 text-3xl font-bold text-slate-900 dark:text-white">
            {t(`pages.learningCenter.articles.${key}.title`)}
          </h1>
          <div className="mt-8 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
          <p className="mt-10 text-xs text-slate-500">{t("pages.learningCenter.footerDisclaimer")}</p>
        </article>
      </section>
    </div>
  );
}
