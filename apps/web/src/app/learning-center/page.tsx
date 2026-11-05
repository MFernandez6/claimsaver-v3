"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketingPage, MarketingSection } from "@/components/marketing-page";
import { type ArticleKey } from "@/data/learningCenter";
import { ARTICLE_SLUGS, articlePath } from "@/data/learningCenter/slugs";

export default function LearningCenterPage() {
  const { t } = useTranslation();
  const keys = Object.keys(ARTICLE_SLUGS) as ArticleKey[];

  return (
    <MarketingPage
      kicker={t("pages.learningCenter.kicker")}
      title={t("pages.learningCenter.title")}
      subtitle={t("pages.learningCenter.subtitle")}
      intro={<p>{t("pages.learningCenter.intro")}</p>}
      note={t("floridaOnly.note")}
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
        <div className="grid gap-4">
          {keys.map((key) => (
            <Link key={key} href={articlePath(key)} className="block">
              <Card className="h-full transition hover:border-teal-300">
                <CardHeader>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">
                    {t("pages.learningCenter.kicker")}
                  </p>
                  <CardTitle className="text-lg leading-snug">
                    {t(`pages.learningCenter.articles.${key}.title`)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {t(`pages.learningCenter.articles.${key}.summary`)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection last>
        <p className="text-xs leading-relaxed text-slate-400">{t("pages.learningCenter.footerDisclaimer")}</p>
      </MarketingSection>
    </MarketingPage>
  );
}
