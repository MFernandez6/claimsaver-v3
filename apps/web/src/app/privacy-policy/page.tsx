"use client";

import { useTranslation } from "react-i18next";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";

export default function PrivacyPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <section className="relative pt-28 pb-20">
        <PageHeroBackdrop />
        <div className="relative z-10 mx-auto max-w-3xl px-4 prose prose-slate">
          <h1>{t("legalPages.privacyTitle")}</h1>
          <p className="text-sm text-slate-500">{t("common.englishControls")}</p>
          <p>{t("legalPages.privacy1")}</p>
          <p>{t("legalPages.privacy2")}</p>
          <p>{t("legalPages.privacy3")}</p>
        </div>
      </section>
    </div>
  );
}
