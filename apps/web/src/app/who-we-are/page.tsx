"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { CHECKOUT_PATH } from "@claimsaver/shared";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";
import { Button } from "@/components/ui/button";

export default function WhoWeArePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <section className="relative overflow-hidden pt-28 pb-20">
        <PageHeroBackdrop />
        <div className="relative z-10 mx-auto max-w-3xl px-4">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            {t("whoWeAre.hero.title")}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            {t("whoWeAre.hero.description")}
          </p>

          <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-700">
            <Image
              src="/images/family.jpg"
              alt={t("whoWeAre.about.imageAlt")}
              width={1200}
              height={800}
              className="h-auto w-full object-cover"
              priority
            />
          </div>

          <h2 className="mt-12 text-2xl font-semibold text-slate-900 dark:text-white">
            {t("whoWeAre.familyStory.title")}
          </h2>
          <p className="mt-2 text-sm font-medium text-teal-800 dark:text-teal-300">
            {t("whoWeAre.familyStory.subtitle")}
          </p>
          <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-white">
            {t("whoWeAre.familyStory.personalJourney.title")}
          </h3>
          <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
            {t("whoWeAre.familyStory.personalJourney.description")}
          </p>
          <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {t("whoWeAre.familyStory.mission.title")}:{" "}
            </span>
            {t("whoWeAre.familyStory.mission.description")}
          </p>
          <blockquote className="mt-6 border-l-4 border-teal-600 pl-4 text-slate-600 italic dark:text-slate-300">
            <p>{t("whoWeAre.familyStory.whyWeCare.quote")}</p>
            <footer className="mt-2 text-sm not-italic font-medium text-slate-500">
              {t("whoWeAre.familyStory.whyWeCare.title")}
            </footer>
          </blockquote>

          <p className="mt-8 leading-relaxed text-slate-600 dark:text-slate-300">
            {t("whoWeAre.about.paragraph3")}
          </p>
          <p className="mt-4 text-sm">
            <Link href="/when-to-call-an-attorney" className="text-teal-800 underline dark:text-teal-300">
              {t("navigation.needProfessionalHelp")}
            </Link>
          </p>
          <p className="mt-6 text-sm text-slate-500">{t("whoWeAre.headquartersNote")}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-800">
              <Link href={CHECKOUT_PATH}>{t("whoWeAre.cta.startClaim")}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/how-it-works">{t("whoWeAre.cta.learnMore")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
