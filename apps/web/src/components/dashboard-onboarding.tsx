"use client";

import Link from "next/link";
import { ClipboardList, FolderUp, CalendarClock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export function DashboardOnboarding({
  welcomeName,
  hasDraft,
  worksheetStep,
}: {
  welcomeName: string;
  hasDraft: boolean;
  worksheetStep: number;
}) {
  const { t } = useTranslation();

  return (
    <section className="overflow-hidden rounded-2xl border border-teal-300/60 bg-gradient-to-br from-teal-100/90 via-white to-emerald-50/90 p-1 shadow-[0_12px_40px_-8px_rgba(20,184,166,0.35)]">
      <div className="rounded-[0.875rem] bg-white/90 px-5 py-6 sm:px-8 sm:py-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">{t("dashboard.onboarding.kicker")}</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {t("dashboard.onboarding.title", { name: welcomeName })}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
          {t("dashboard.onboarding.body")}
        </p>

        <ol className="mt-6 grid gap-3 sm:grid-cols-3">
          <li className="rounded-xl border border-teal-200 bg-teal-50/60 p-4">
            <ClipboardList className="h-5 w-5 text-teal-800" aria-hidden />
            <p className="mt-2 text-sm font-semibold text-slate-900">{t("dashboard.onboarding.step1title")}</p>
            <p className="mt-1 text-xs text-slate-600">{t("dashboard.onboarding.step1body")}</p>
          </li>
          <li className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <FolderUp className="h-5 w-5 text-slate-600" aria-hidden />
            <p className="mt-2 text-sm font-semibold text-slate-900">{t("dashboard.onboarding.step2title")}</p>
            <p className="mt-1 text-xs text-slate-600">{t("dashboard.onboarding.step2body")}</p>
          </li>
          <li className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <CalendarClock className="h-5 w-5 text-slate-600" aria-hidden />
            <p className="mt-2 text-sm font-semibold text-slate-900">{t("dashboard.onboarding.step3title")}</p>
            <p className="mt-1 text-xs text-slate-600">{t("dashboard.onboarding.step3body")}</p>
          </li>
        </ol>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-800">
            <Link href="/claim-form">
              {hasDraft
                ? t("dashboard.onboarding.continueWorksheet", { step: worksheetStep })
                : t("dashboard.onboarding.startWorksheet")}
            </Link>
          </Button>
          <p className="text-xs text-slate-500">{t("dashboard.onboarding.youRemainFiler")}</p>
        </div>
      </div>
    </section>
  );
}
