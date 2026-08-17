"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { CHECKOUT_PATH } from "@claimsaver/shared";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";
import { Button } from "@/components/ui/button";
import { LocalizedSocialImage } from "@/components/graphics/localized-social-image";

export default function HowItWorksPage() {
  const { t } = useTranslation();
  const steps = [1, 2, 3, 4, 5] as const;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <section className="relative overflow-hidden pt-28 pb-20">
        <PageHeroBackdrop />
        <div className="relative z-10 mx-auto max-w-3xl px-4">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{t("pages.howItWorks.title")}</h1>
          <p className="mt-3 text-xl text-teal-800 dark:text-teal-300">{t("pages.howItWorks.subtitle")}</p>
          <p className="mt-4 text-slate-600 dark:text-slate-300">{t("pages.howItWorks.intro")}</p>
          <p className="mt-3 text-slate-600 dark:text-slate-300">{t("whatWeDo.hero.description")}</p>
          <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700">
            <LocalizedSocialImage
              baseName="week1-wed-pip-5-steps"
              alt={t("home.story.pipStepsAlt")}
              width={1600}
              height={900}
              className="h-auto w-full object-cover"
            />
          </div>
          <p className="mt-3 text-center text-xs text-slate-500">{t("home.graphicCaption")}</p>
          <ol className="mt-12 space-y-8">
            {steps.map((n) => (
              <li key={n} className="flex gap-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-emerald-800 text-sm font-bold text-white">
                  {n}
                </span>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {t(`pages.howItWorks.step${n}Title`)}
                  </h2>
                  <p className="mt-1 text-slate-600 dark:text-slate-300">
                    {t(`pages.howItWorks.step${n}Body`)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <h2 className="mt-14 text-2xl font-semibold text-slate-900 dark:text-white">
            {t("pages.howItWorks.includesTitle")}
          </h2>
          <ol className="mt-8 space-y-8">
            {([1, 2, 3, 4, 5, 6, 7] as const).map((n) => (
              <li key={n} className="flex gap-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-emerald-800 text-sm font-bold text-white">
                  {n}
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {t(`pages.howItWorks.include${n}Title`)}
                  </h3>
                  <p className="mt-1 text-slate-600 dark:text-slate-300">
                    {t(`pages.howItWorks.include${n}Body`)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-sm text-slate-500">
            {t("pages.howItWorks.notarizationNote")}
          </p>
          <div className="mt-8 flex gap-3">
            <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-800">
              <Link href="/pricing">{t("pages.howItWorks.viewPricing")}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={CHECKOUT_PATH}>{t("cta.primary")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
