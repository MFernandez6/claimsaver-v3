"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketingHeading, MarketingPage, MarketingSection } from "@/components/marketing-page";
import { getLearningArticleParagraphs } from "@/data/learningCenter";
import { getLearningArticleFaqs } from "@/data/learningCenter/faqs";
import { SLUG_TO_ARTICLE } from "@/data/learningCenter/slugs";

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { t, i18n } = useTranslation();
  const key = SLUG_TO_ARTICLE[slug];
  if (!key) notFound();
  const paragraphs = getLearningArticleParagraphs(i18n.language, key);
  const faqs = getLearningArticleFaqs(i18n.language, key);

  return (
    <MarketingPage
      kicker={t("pages.learningCenter.kicker")}
      title={t(`pages.learningCenter.articles.${key}.title`)}
      subtitle={t(`pages.learningCenter.articles.${key}.summary`)}
      intro={
        <p>
          <Link href="/learning-center" className="font-semibold text-teal-800 underline underline-offset-2">
            ← {t("pages.learningCenter.title")}
          </Link>
        </p>
      }
      actions={
        <>
          <Button asChild className="h-12 bg-gradient-to-r from-emerald-600 to-teal-800">
            <Link href="/how-it-works">{t("navigation.howItWorks")}</Link>
          </Button>
          <Button variant="outline" asChild className="h-12">
            <Link href="/when-to-call-an-attorney">{t("navigation.needProfessionalHelp")}</Link>
          </Button>
        </>
      }
    >
      <MarketingSection>
        <div className="space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
          {paragraphs.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
      </MarketingSection>

      {faqs.length ? (
        <MarketingSection>
          <MarketingHeading>{t("pages.learningCenter.faqTitle")}</MarketingHeading>
          <div className="mt-6 space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.question}>
                <CardHeader>
                  <CardTitle className="text-base leading-snug">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </MarketingSection>
      ) : null}

      <MarketingSection last>
        <p className="text-xs leading-relaxed text-slate-400">{t("pages.learningCenter.footerDisclaimer")}</p>
      </MarketingSection>
    </MarketingPage>
  );
}
