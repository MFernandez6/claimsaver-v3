"use client";

import { useTranslation } from "react-i18next";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";

export function LegalDoc({
  i18nPrefix,
  sectionCount,
}: {
  i18nPrefix: string;
  sectionCount: number;
}) {
  const { t } = useTranslation();
  const sections = Array.from({ length: sectionCount }, (_, i) => i + 1);

  return (
    <div className="min-h-screen">
      <section className="relative pt-28 pb-20">
        <PageHeroBackdrop />
        <div className="relative z-10 mx-auto max-w-3xl px-4 space-y-8 text-slate-700">
          <header className="space-y-2">
            <h1 className="text-4xl font-bold text-slate-900">{t(`${i18nPrefix}.title`)}</h1>
            <p className="text-sm text-slate-500">{t(`${i18nPrefix}.updated`)}</p>
            <p className="text-sm text-slate-500">{t("common.englishControls")}</p>
          </header>
          <p className="leading-relaxed">{t(`${i18nPrefix}.intro`)}</p>
          {sections.map((n) => (
            <section key={n} className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-900">{t(`${i18nPrefix}.s${n}Title`)}</h2>
              <p className="whitespace-pre-line leading-relaxed">{t(`${i18nPrefix}.s${n}Body`)}</p>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
