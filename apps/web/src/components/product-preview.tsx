"use client";

import { CalendarClock, FileStack, ListChecks } from "lucide-react";
import { useTranslation } from "react-i18next";
import { WORKSHEET_STEPS } from "@claimsaver/shared";

export function ProductPreview() {
  const { t } = useTranslation();

  return (
    <section className="border-y border-slate-200/70 bg-slate-50/90 py-16 dark:border-slate-800/60 dark:bg-slate-950/40">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <h2 className="mb-3 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
            {t("home.productPreview.title")}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">{t("home.productPreview.subtitle")}</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-800 dark:text-teal-300">
              {t("home.hero.dashboardPreviewBadge")}
            </p>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-800 dark:bg-teal-950/50 dark:text-teal-200">
              <ListChecks className="h-5 w-5" aria-hidden />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              {t("home.productPreview.worksheetTitle")}
            </h3>
            <ol className="mt-3 space-y-1.5">
              {WORKSHEET_STEPS.slice(0, 5).map((step, index) => (
                <li key={step.key} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-[10px] font-bold text-teal-800 dark:bg-teal-950/70 dark:text-teal-200">
                    {index + 1}
                  </span>
                  <span className="truncate">{t(`claimForm.worksheetSteps.${step.key}`)}</span>
                </li>
              ))}
            </ol>
          </article>
          <article className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-800 dark:text-teal-300">
              {t("home.hero.dashboardPreviewBadge")}
            </p>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
              <FileStack className="h-5 w-5" aria-hidden />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              {t("home.productPreview.vaultTitle")}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {t("home.hero.visualDocsHint")}
            </p>
            <p className="mt-4 text-sm font-medium text-slate-800 dark:text-slate-100">
              {t("home.hero.visualDocsTitle")}
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-800 dark:text-teal-300">
              {t("home.hero.dashboardPreviewBadge")}
            </p>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-800 dark:bg-teal-950/50 dark:text-teal-200">
              <CalendarClock className="h-5 w-5" aria-hidden />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              {t("home.productPreview.calendarTitle")}
            </h3>
            <p className="mt-3 text-sm font-medium text-slate-800 dark:text-slate-100">
              {t("home.hero.visualDeadlineTitle")}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t("home.hero.visualDeadlineHint")}</p>
            <p className="mt-3 text-xs text-slate-500">{t("pitch.fourteenDayNote")}</p>
          </article>
        </div>
        <p className="mt-3 text-center text-xs text-slate-500">{t("home.productPreview.caption")}</p>
      </div>
    </section>
  );
}
