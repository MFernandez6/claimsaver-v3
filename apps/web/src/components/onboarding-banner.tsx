"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "csplus.onboardingBanner.dismissed";

export function OnboardingBanner({
  name,
  currentStep,
  worksheetComplete,
}: {
  name: string;
  currentStep: number;
  worksheetComplete: boolean;
}) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(window.localStorage.getItem(STORAGE_KEY) !== "1");
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* Private mode — still hide for this visit. */
    }
    setVisible(false);
  }

  if (!visible) return null;

  const cta = worksheetComplete
    ? t("dashboard.progress.review")
    : currentStep > 1
      ? t("dashboard.onboarding.continueWorksheet", { step: currentStep })
      : t("dashboard.onboarding.startWorksheet");

  return (
    <aside className="mb-6 rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-5 shadow-sm dark:border-teal-800 dark:from-teal-950/40 dark:to-slate-950">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-800 dark:text-teal-200">
        {t("dashboard.onboarding.kicker")}
      </p>
      <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
        {t("dashboard.onboarding.title", { name })}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {t("dashboard.onboarding.body")}
      </p>
      <ol className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">
        <li>
          <span className="font-medium">{t("dashboard.onboarding.step1title")}</span>
          <span className="block text-slate-500">{t("dashboard.onboarding.step1body")}</span>
        </li>
        <li>
          <span className="font-medium">{t("dashboard.onboarding.step2title")}</span>
          <span className="block text-slate-500">{t("dashboard.onboarding.step2body")}</span>
        </li>
        <li>
          <span className="font-medium">{t("dashboard.onboarding.step3title")}</span>
          <span className="block text-slate-500">{t("dashboard.onboarding.step3body")}</span>
        </li>
      </ol>
      <p className="mt-3 text-xs text-slate-500">{t("dashboard.onboarding.youRemainFiler")}</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-800">
          <Link href="/claim-form" onClick={dismiss}>
            {cta}
          </Link>
        </Button>
        <Button type="button" variant="outline" onClick={dismiss}>
          {t("dashboard.onboarding.dismiss")}
        </Button>
      </div>
    </aside>
  );
}
