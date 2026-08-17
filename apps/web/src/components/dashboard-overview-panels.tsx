"use client";

import {
  CalendarClock,
  FileStack,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export type DashboardOverviewPanelsProps = {
  /** Marketing hero uses fixed numbers; dashboard uses real counts */
  completedSteps: number;
  totalSteps: number;
  documentsCount: number;
  /** Next upcoming calendar event (optional) */
  nextEvent: { title: string; dateLabel: string } | null;
  /** Dashboard only: welcome banner; omit on homepage preview */
  welcomeName?: string | null;
  /** Homepage hero: label as illustrative mock so it is not mistaken for a live dashboard */
  variant?: "live" | "preview";
};

/**
 * Same layout as the homepage dashboard preview — progress + stats + bento row.
 */
export function DashboardOverviewPanels({
  completedSteps,
  totalSteps,
  documentsCount,
  nextEvent,
  welcomeName,
  variant = "live",
}: DashboardOverviewPanelsProps) {
  const { t } = useTranslation();
  const isPreview = variant === "preview";
  const pct =
    totalSteps > 0
      ? Math.min(100, Math.round((completedSteps / totalSteps) * 100))
      : 0;

  const stepsLabel = `${completedSteps} / ${totalSteps}`;

  const Root = isPreview ? "section" : "div";

  return (
    <Root
      className={cn("relative w-full", isPreview && "pointer-events-none select-none")}
      aria-labelledby={isPreview ? "dashboard-hero-preview-label" : undefined}
    >
      {isPreview ? (
        <div className="mb-4 space-y-1.5">
          <div
            id="dashboard-hero-preview-label"
            className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50/95 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-teal-900 shadow-sm dark:border-teal-800/80 dark:bg-teal-950/70 dark:text-teal-100"
          >
            <span
              className="h-1.5 w-1.5 rounded-full bg-teal-500 dark:bg-teal-400"
              aria-hidden
            />
            {t("home.hero.dashboardPreviewBadge")}
          </div>
          <p className="max-w-md text-sm leading-snug text-slate-600 dark:text-slate-400">
            {t("home.hero.dashboardPreviewHint")}
          </p>
        </div>
      ) : null}

      <div
        className={cn(
          "relative",
          isPreview &&
            "rounded-2xl p-3 ring-2 ring-dashed ring-teal-300/70 ring-offset-2 ring-offset-slate-50 dark:ring-teal-600/50 dark:ring-offset-slate-950 sm:p-4",
        )}
      >
        <div
          className="pointer-events-none absolute -left-8 -top-12 h-64 w-64 rounded-full bg-teal-400/25 blur-3xl dark:bg-teal-500/15"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-6 bottom-0 h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl dark:bg-emerald-400/10"
          aria-hidden
        />

        <div className="relative">
        {welcomeName != null ? (
          <div
            className="mb-6 overflow-hidden rounded-2xl border border-teal-300/60 bg-gradient-to-br from-teal-100/90 via-white to-emerald-50/90 p-1 shadow-[0_12px_40px_-8px_rgba(20,184,166,0.45)] ring-2 ring-teal-500/25 dark:border-teal-700/50 dark:from-teal-950/80 dark:via-slate-900 dark:to-emerald-950/50 dark:shadow-[0_12px_40px_-8px_rgba(20,184,166,0.2)] dark:ring-teal-400/20"
            role="status"
            aria-live="polite"
          >
            <div className="flex flex-col gap-4 rounded-[0.875rem] bg-white/85 px-5 py-5 backdrop-blur-sm dark:bg-slate-950/60 sm:flex-row sm:items-center sm:gap-6 sm:px-6 sm:py-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-800 text-white shadow-lg shadow-teal-900/30">
                <LayoutDashboard className="h-7 w-7" aria-hidden />
              </div>
              <p className="text-lg font-semibold leading-snug tracking-tight text-slate-900 dark:text-slate-100 sm:text-xl">
                {welcomeName ? (
                  <Trans
                    i18nKey="dashboard.overviewWelcome"
                    values={{ name: welcomeName }}
                    components={{
                      name: (
                        <span className="font-semibold text-teal-700 dark:text-teal-400" />
                      ),
                    }}
                  />
                ) : (
                  t("dashboard.welcome")
                )}
              </p>
            </div>
          </div>
        ) : null}

        <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-6 shadow-[0_24px_80px_-12px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/85 dark:shadow-[0_24px_80px_-12px_rgba(0,0,0,0.45)]">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {t("home.hero.visualProgressTitle")}
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {t("home.hero.visualProgressSubtitle")}
              </p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-emerald-800 text-white shadow-lg shadow-teal-900/20">
              <ShieldCheck className="h-6 w-6" aria-hidden />
            </div>
          </div>

          <div className="mb-2 flex items-end justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
            <span>{t("home.hero.visualStepsDone")}</span>
            <span className="tabular-nums text-teal-700 dark:text-teal-400">
              {stepsLabel}
            </span>
          </div>
          <div
            className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
            role={isPreview ? "presentation" : "progressbar"}
            aria-hidden={isPreview ? true : undefined}
            aria-valuenow={isPreview ? undefined : pct}
            aria-valuemin={isPreview ? undefined : 0}
            aria-valuemax={isPreview ? undefined : 100}
            aria-label={isPreview ? undefined : t("home.hero.visualProgressTitle")}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 shadow-[0_0_20px_rgba(20,184,166,0.45)] transition-[width] duration-500 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-5 dark:border-slate-800">
            {[
              t("home.hero.visualStat1"),
              t("home.hero.visualStat2"),
              t("home.hero.visualStat3"),
            ].map((label) => (
              <div
                key={label}
                className="rounded-lg bg-slate-50/90 px-2 py-2 text-center dark:bg-slate-800/60"
              >
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex gap-4 rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white to-slate-50/90 p-4 shadow-lg backdrop-blur-sm dark:border-slate-700/80 dark:from-slate-900/90 dark:to-slate-900/60">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300">
              <CalendarClock className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                {t("home.hero.visualDeadlineTitle")}
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {nextEvent
                  ? `${nextEvent.title} · ${nextEvent.dateLabel}`
                  : t("dashboard.overviewNoUpcoming")}
              </p>
            </div>
          </div>

          <div className="flex gap-4 rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white to-emerald-50/40 p-4 shadow-lg backdrop-blur-sm dark:border-slate-700/80 dark:from-slate-900/90 dark:to-emerald-950/20">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
              <FileStack className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                {t("home.hero.visualDocsTitle")}
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {t("dashboard.overviewDocsCount", { count: documentsCount })}
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </Root>
  );
}
