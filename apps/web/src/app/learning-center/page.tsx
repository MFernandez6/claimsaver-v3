"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";
import { getLearningArticleParagraphs, type ArticleKey } from "@/data/learningCenter";
import { ARTICLE_SLUGS, articlePath } from "@/data/learningCenter/slugs";

export default function LearningCenterPage() {
  const { t, i18n } = useTranslation();
  const keys = Object.keys(ARTICLE_SLUGS) as ArticleKey[];
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden pt-28 pb-20">
        <PageHeroBackdrop />
        <div className="relative z-10 mx-auto max-w-3xl px-4">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{t("pages.learningCenter.title")}</h1>
          <p className="mt-3 text-slate-600">{t("pages.learningCenter.intro")}</p>
          <ul className="mt-10 space-y-4">
            {keys.map((key) => (
              <li key={key}>
                <Link href={articlePath(key)} className="block rounded-xl border bg-white/80 p-5 hover:border-teal-400">
                  <h2 className="font-semibold text-slate-900">{t(`pages.learningCenter.articles.${key}.title`)}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                    {getLearningArticleParagraphs(i18n.language, key)[0]}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-xs text-slate-500">{t("pages.learningCenter.footerDisclaimer")}</p>
        </div>
      </section>
    </div>
  );
}
