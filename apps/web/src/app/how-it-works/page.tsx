"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { START_PATH } from "@claimsaver/shared";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";
import { ProductVideo } from "@/components/product-video";
import { Button } from "@/components/ui/button";

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
          <p className="mt-3 text-slate-600 dark:text-slate-300">{t("copy.patientPrice.short")}</p>
          <p className="mt-3 text-slate-600 dark:text-slate-300">{t("whatWeDo.hero.description")}</p>
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">
            {t("pages.howItWorks.walkthroughKicker")}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
            {t("pages.howItWorks.walkthroughTitle")}
          </h2>
          <div className="mt-4">
            <ProductVideo
              src="/walkthroughs/user.mp4"
              title={t("pages.howItWorks.walkthroughTitle")}
              caption={t("pages.howItWorks.walkthroughCaption")}
            />
          </div>
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
            {t("pages.howItWorks.futureAddonsNote")}
          </p>
          <div className="mt-8 flex gap-3">
            <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-800">
              <Link href={START_PATH}>{t("cta.payAccess")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
