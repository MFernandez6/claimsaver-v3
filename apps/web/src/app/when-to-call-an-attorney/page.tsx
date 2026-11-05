"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MarketingHeading, MarketingPage, MarketingSection } from "@/components/marketing-page";

const BULLETS = ["serious", "denied", "multi", "euo", "overlapping", "fraud", "advice"] as const;

export default function WhenToCallPage() {
  const { t } = useTranslation();

  return (
    <MarketingPage
      kicker={t("pages.needProfessionalHelp.kicker")}
      title={t("pages.needProfessionalHelp.title")}
      subtitle={t("pages.needProfessionalHelp.notEveryClaim")}
      intro={<p>{t("pages.needProfessionalHelp.introDiy")}</p>}
      note={t("floridaOnly.note")}
      actions={
        <>
          <Button asChild className="h-12 bg-gradient-to-r from-emerald-600 to-teal-800">
            <Link href="/how-it-works">{t("navigation.howItWorks")}</Link>
          </Button>
          <Button variant="outline" asChild className="h-12">
            <Link href="/">{t("common.home")}</Link>
          </Button>
        </>
      }
    >
      <MarketingSection>
        <MarketingHeading>{t("pages.needProfessionalHelp.subtitle")}</MarketingHeading>
        <Card className="mt-6">
          <CardContent className="pt-6">
            <ul className="list-disc space-y-3 pl-5 text-slate-700 dark:text-slate-300">
              {BULLETS.map((key) => (
                <li key={key}>{t(`pages.needProfessionalHelp.bullets.${key}`)}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </MarketingSection>

      <MarketingSection>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6 text-sm leading-relaxed text-slate-700">
            {t("pages.needProfessionalHelp.supportNote")}
          </CardContent>
        </Card>
      </MarketingSection>

      <MarketingSection last>
        <p className="text-sm leading-relaxed text-slate-600">{t("pages.needProfessionalHelp.closing")}</p>
        <p className="mt-4 text-xs leading-relaxed text-slate-400">{t("pages.learningCenter.footerDisclaimer")}</p>
      </MarketingSection>
    </MarketingPage>
  );
}
