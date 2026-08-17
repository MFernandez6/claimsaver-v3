"use client";

import { useTranslation } from "react-i18next";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";

export default function TermsPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <section className="relative pt-28 pb-20">
        <PageHeroBackdrop />
        <div className="relative z-10 mx-auto max-w-3xl px-4 space-y-4 text-slate-700">
          <h1 className="text-4xl font-bold text-slate-900">{t("legalPages.termsTitle")}</h1>
          <p className="text-sm text-slate-500">{t("common.englishControls")}</p>
          <p>{t("footer.legalText")}</p>
          <p>{t("legalPages.terms1")}</p>
          <p>{t("legalPages.terms2")}</p>
        </div>
      </section>
    </div>
  );
}
