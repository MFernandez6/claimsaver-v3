"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ObfuscatedSupportEmail } from "@/components/obfuscated-support-email";
import { MarketingHeading, MarketingPage, MarketingSection } from "@/components/marketing-page";
import { ClinicPricingNote } from "@/components/clinic-pricing-note";

const STEPS = [1, 2, 3, 4, 5] as const;
const SEE = [1, 2, 3] as const;
const HIDE = [1, 2, 3] as const;

export default function ForClinicsPage() {
  const { t } = useTranslation();

  return (
    <MarketingPage
      kicker={t("pages.forClinics.kicker")}
      title={t("pages.forClinics.title")}
      subtitle={t("pages.forClinics.subtitle")}
      intro={
        <>
          <p>{t("copy.clinic.valueProp")}</p>
          <p>{t("pages.forClinics.intro")}</p>
        </>
      }
      actions={
        <>
          <Button asChild className="h-12 bg-gradient-to-r from-emerald-600 to-teal-800">
            <Link href="/clinic-demo">{t("pages.forClinics.ctaDemo")}</Link>
          </Button>
          <Button variant="outline" asChild className="h-12">
            <Link href="/contact">{t("pages.forClinics.ctaContact")}</Link>
          </Button>
        </>
      }
    >
      <MarketingSection>
        <MarketingHeading>{t("pages.forClinics.howTitle")}</MarketingHeading>
        <ol className="mt-8 space-y-8">
          {STEPS.map((n) => (
            <li key={n} className="flex gap-4 sm:gap-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-emerald-800 text-sm font-bold text-white">
                {n}
              </span>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-slate-900 sm:text-xl dark:text-white">
                  {t(`pages.forClinics.step${n}Title`)}
                </h3>
                <p className="mt-1 text-slate-600 dark:text-slate-300">
                  {n === 4
                    ? t("copy.patientPrice.sameForReferrals")
                    : n === 5
                      ? t("copy.clinic.visibility")
                      : t(`pages.forClinics.step${n}Body`)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </MarketingSection>

      <MarketingSection className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("pages.forClinics.seeTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
              {SEE.map((n) => (
                <li key={n}>{t(`pages.forClinics.see${n}`)}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-base">{t("pages.forClinics.hideTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
              {HIDE.map((n) => (
                <li key={n}>{t(`pages.forClinics.hide${n}`)}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </MarketingSection>

      <MarketingSection last>
        <ClinicPricingNote ctaHref="/clinic-demo" ctaLabel={t("pages.forClinics.ctaDemo")} />
        <p className="mt-8 text-sm leading-relaxed text-slate-600">{t("copy.disclaimer.selfHelp")}</p>
        <p className="mt-4 text-sm text-slate-500">
          {t("pages.forClinics.questions")} <ObfuscatedSupportEmail className="underline" />
        </p>
        <p className="mt-4 text-xs leading-relaxed text-slate-400">{t("pages.forClinics.disclaimer")}</p>
      </MarketingSection>
    </MarketingPage>
  );
}
