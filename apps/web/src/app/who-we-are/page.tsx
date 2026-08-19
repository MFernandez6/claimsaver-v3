"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CHECKOUT_PATH } from "@claimsaver/shared";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";
import { Button } from "@/components/ui/button";

export default function WhoWeArePage() {
  const { t } = useTranslation();
  const valueKeys = ["mission", "vision", "values"] as const;

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden pt-28 pb-20">
        <PageHeroBackdrop />
        <div className="relative z-10 mx-auto max-w-6xl px-4">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            {t("whoWeAre.hero.title")} {t("whoWeAre.hero.subtitle")}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
            {t("whoWeAre.hero.description")}
          </p>

          <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-5 text-slate-700 dark:text-slate-300">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                {t("whoWeAre.familyStory.title")}
              </h2>
              <p className="text-xl text-teal-800 dark:text-teal-300">
                {t("whoWeAre.familyStory.subtitle")}
              </p>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t("whoWeAre.familyStory.personalJourney.title")}
              </h3>
              <p>{t("whoWeAre.familyStory.personalJourney.description")}</p>
              <p>
                <strong>{t("whoWeAre.familyStory.mission.title")}:</strong>{" "}
                {t("whoWeAre.familyStory.mission.description")}
              </p>
              <blockquote className="border-l-4 border-teal-600 pl-4 text-slate-600 italic dark:text-slate-300">
                <p>{t("whoWeAre.familyStory.whyWeCare.quote")}</p>
                <footer className="mt-2 text-sm not-italic font-medium text-slate-500">
                  {t("whoWeAre.familyStory.whyWeCare.title")}
                </footer>
              </blockquote>
              <p className="text-sm text-slate-500">{t("whoWeAre.headquartersNote")}</p>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="/images/family.jpg"
                  alt={t("whoWeAre.about.imageAlt")}
                  width={1200}
                  height={800}
                  className="h-auto w-full object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-5 -right-2 flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-lg dark:bg-slate-800 sm:-right-4">
                <Heart className="h-5 w-5 text-red-500" />
                <span className="font-semibold text-slate-900 dark:text-white">
                  {t("whoWeAre.about.familyFirst")}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-24">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              {t("whoWeAre.coreValues.title")}
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">{t("whoWeAre.coreValues.subtitle")}</p>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {valueKeys.map((key) => (
                <div
                  key={key}
                  className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60"
                >
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {t(`whoWeAre.values.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {t(`whoWeAre.values.${key}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 max-w-3xl">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              {t("whoWeAre.cta.title")}
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">{t("whoWeAre.cta.description")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-800">
                <Link href={CHECKOUT_PATH}>{t("whoWeAre.cta.startClaim")}</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/how-it-works">{t("whoWeAre.cta.learnMore")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
