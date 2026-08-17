"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CHECKOUT_PATH } from "@claimsaver/shared";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";
import { PitchNarrative } from "@/components/pitch-narrative";
import { Button } from "@/components/ui/button";

export default function WhoWeArePage() {
  const { t } = useTranslation();
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
            <div className="space-y-6 text-slate-700 dark:text-slate-300">
              <p>{t("whoWeAre.familyStory.personalJourney.description")}</p>
              <p>
                <strong>{t("whoWeAre.values.mission.title")}:</strong> {t("whoWeAre.values.mission.description")}
              </p>
              <p>
                <strong>{t("whoWeAre.values.vision.title")}:</strong> {t("whoWeAre.values.vision.description")}
              </p>
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

          <div className="mt-20 max-w-3xl rounded-2xl border border-slate-200 bg-white/80 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
            <PitchNarrative compact />
          </div>

          <Button asChild className="mt-12 bg-gradient-to-r from-emerald-600 to-teal-800">
            <Link href={CHECKOUT_PATH}>{t("cta.primary")}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
