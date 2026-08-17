"use client";

import { useTranslation } from "react-i18next";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";

export default function DataHandlingPage() {
  const { t } = useTranslation();
  const sections = [1, 2, 3, 4, 5, 6, 7, 8] as const;
  return (
    <div className="min-h-screen">
      <section className="relative pt-28 pb-20">
        <PageHeroBackdrop />
        <div className="relative z-10 mx-auto max-w-3xl px-4 space-y-4 text-slate-700">
          <h1 className="text-4xl font-bold text-slate-900">{t("pages.dataHandling.title")}</h1>
          <p>{t("pages.dataHandling.intro")}</p>
          {sections.map((n) => (
            <div key={n} className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-900">{t(`pages.dataHandling.section${n}Title`)}</h2>
              <p>{t(`pages.dataHandling.section${n}Body`)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
