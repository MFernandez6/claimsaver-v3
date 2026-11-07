"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { START_PATH } from "@claimsaver/shared";
import { Button } from "@/components/ui/button";
import FAQ from "@/components/faq";
import { MarketingHeading, MarketingPage, MarketingSection } from "@/components/marketing-page";

export default function LawyerDeclinedPage() {
  const { t } = useTranslation();

  return (
    <MarketingPage
      kicker={t("pages.lawyerDeclined.kicker")}
      title={t("pages.lawyerDeclined.title")}
      subtitle={t("pages.lawyerDeclined.subtitle")}
      intro={<p>{t("pages.lawyerDeclined.intro")}</p>}
      note={t("pages.lawyerDeclined.note")}
      actions={
        <>
          <Button asChild className="h-12 bg-gradient-to-r from-emerald-600 to-teal-800">
            <Link href={START_PATH}>{t("cta.payAccess")}</Link>
          </Button>
          <Button variant="outline" asChild className="h-12">
            <Link href="/when-to-call-an-attorney">{t("navigation.needProfessionalHelp")}</Link>
          </Button>
        </>
      }
    >
      <MarketingSection>
        <MarketingHeading>{t("pages.lawyerDeclined.economicsTitle")}</MarketingHeading>
        <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
          {t("pages.lawyerDeclined.economicsBody")}
        </p>
      </MarketingSection>

      <MarketingSection>
        <MarketingHeading>{t("pages.lawyerDeclined.diyTitle")}</MarketingHeading>
        <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
          {t("pages.lawyerDeclined.diyBody")}
        </p>
      </MarketingSection>

      <MarketingSection>
        <MarketingHeading>{t("pages.lawyerDeclined.flatTitle")}</MarketingHeading>
        <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
          {t("pages.lawyerDeclined.flatBody")}
        </p>
      </MarketingSection>

      <MarketingSection>
        <MarketingHeading>{t("pages.lawyerDeclined.attorneyTitle")}</MarketingHeading>
        <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
          {t("pages.lawyerDeclined.attorneyBody")}{" "}
          <Link href="/when-to-call-an-attorney" className="font-semibold text-teal-800 underline underline-offset-2">
            {t("navigation.needProfessionalHelp")}
          </Link>
          .
        </p>
      </MarketingSection>

      <MarketingSection last>
        <FAQ
          title={t("pages.lawyerDeclined.faqTitle")}
          subtitle={t("pages.lawyerDeclined.faqSubtitle")}
          items={[
            { question: t("pages.lawyerDeclined.faq1.question"), answer: t("pages.lawyerDeclined.faq1.answer") },
            { question: t("pages.lawyerDeclined.faq2.question"), answer: t("pages.lawyerDeclined.faq2.answer") },
            { question: t("pages.lawyerDeclined.faq3.question"), answer: t("pages.lawyerDeclined.faq3.answer") },
            { question: t("pages.lawyerDeclined.faq4.question"), answer: t("pages.lawyerDeclined.faq4.answer") },
          ]}
        />
        <p className="mt-6 text-xs leading-relaxed text-slate-400">{t("pages.learningCenter.footerDisclaimer")}</p>
      </MarketingSection>
    </MarketingPage>
  );
}
