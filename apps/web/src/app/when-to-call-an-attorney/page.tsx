"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";
import { Button } from "@/components/ui/button";

export default function WhenToCallPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden pt-28 pb-20">
        <PageHeroBackdrop />
        <div className="relative z-10 mx-auto max-w-3xl px-4">
          <div className="mb-6 flex items-center gap-3 text-amber-600">
            <AlertTriangle className="h-10 w-10" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t("pages.needProfessionalHelp.title")}</h1>
          </div>
          <p className="text-lg text-teal-800">{t("pages.needProfessionalHelp.notEveryClaim")}</p>
          <p className="mt-4 text-slate-600">
            {t("pages.needProfessionalHelp.introDiy")}
          </p>
          <ul className="mt-6 space-y-3 text-slate-700">
            <li>• {t("pages.needProfessionalHelp.bullets.serious")}</li>
            <li>• {t("pages.needProfessionalHelp.bullets.denied")}</li>
            <li>• {t("pages.needProfessionalHelp.bullets.multi")}</li>
            <li>• {t("pages.needProfessionalHelp.bullets.euo")}</li>
            <li>• {t("pages.needProfessionalHelp.bullets.overlapping")}</li>
            <li>• {t("pages.needProfessionalHelp.bullets.fraud")}</li>
            <li>• {t("pages.needProfessionalHelp.bullets.advice")}</li>
          </ul>
          <p className="mt-8 border-l-4 border-teal-500 pl-4 text-slate-600">
            {t("pages.needProfessionalHelp.supportNote")}
          </p>
          <div className="mt-8 flex gap-3">
            <Button variant="outline" asChild><Link href="/">{t("common.home")}</Link></Button>
            <Button asChild><Link href="/how-it-works">{t("navigation.howItWorks")}</Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
}
