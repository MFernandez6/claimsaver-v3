"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";
import { Button } from "@/components/ui/button";

export default function NotarizationPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden pt-28 pb-20">
        <PageHeroBackdrop />
        <div className="relative z-10 mx-auto max-w-3xl px-4">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{t("notarization.pageTitle")}</h1>
          <p className="mt-4 text-slate-600">
            {t("notarization.pageIntro")}
          </p>
          <ul className="mt-6 list-disc space-y-2 pl-5 text-slate-700">
            <li>{t("notarization.needId")}</li>
            <li>{t("notarization.needDevice")}</li>
            <li>{t("notarization.needPdf")}</li>
            <li>{t("notarization.needAvailability")}</li>
          </ul>
          <p className="mt-6 text-sm text-slate-500">{t("notarization.notLegalReview")}</p>
          <Button asChild className="mt-8"><Link href="/pricing">{t("notarization.addAtCheckout")}</Link></Button>
        </div>
      </section>
    </div>
  );
}
