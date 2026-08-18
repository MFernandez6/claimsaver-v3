"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  Check,
  FileStack,
  LayoutDashboard,
} from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import {
  TOTAL_WORKSHEET_STEPS,
  WORKSHEET_STEPS,
} from "@claimsaver/shared";
import { cn } from "@/lib/utils";

export type DashboardOverviewPanelsProps = {
  /** 1-based worksheet step the user is currently on */
  currentStep: number;
  totalSteps?: number;
  /** True when every required worksheet step, including the review signature, is saved */
  worksheetComplete?: boolean;
  documentsCount: number;
  calendarCount?: number;
  expensesCount?: number;
  /** Most recently marked-done calendar reminder */
  lastCompleted?: { title: string; dateLabel: string } | null;
  /** Next upcoming calendar event (optional) */
  nextEvent: { title: string; dateLabel: string } | null;
  /** Dashboard only: welcome banner; omit on homepage preview */
  welcomeName?: string | null;
  /** Homepage hero: label as illustrative mock so it is not mistaken for a live dashboard */
  variant?: "live" | "preview";
};

function clampStep(step: number, total: number) {
  return Math.min(Math.max(1, Math.trunc(step) || 1), total);
}

function claimProgressPercent({
  currentStep,
  totalSteps,
  worksheetComplete,
  documentsCount,
  calendarCount,
  expensesCount,
}: {
  currentStep: number;
  totalSteps: number;
  worksheetComplete: boolean;
  documentsCount: number;
  calendarCount: number;
  expensesCount: number;
}) {
  const total = Math.max(1, totalSteps);
  const current = clampStep(currentStep, total);
  const completed = worksheetComplete ? total : Math.max(0, current - 1);
  const worksheetScore = worksheetComplete ? 1 : (completed + 0.4) / total;
  const docsScore = Math.min(1, documentsCount / 3);
  const calendarScore = calendarCount > 0 ? 1 : 0;
  const expensesScore = expensesCount > 0 ? 1 : 0;
  return Math.min(
    100,
    Math.round(
      worksheetScore * 70 + docsScore * 18 + calendarScore * 7 + expensesScore * 5,
    ),
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

function useAnimatedNumber(target: number, durationMs = 900) {
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(0);
  const valueRef = useRef(0);

  useEffect(() => {
    if (reduced) {
      valueRef.current = target;
      setValue(target);
      return;
    }
    const from = valueRef.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - t) ** 3;
      const next = Math.round(from + (target - from) * eased);
      valueRef.current = next;
      setValue(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, reduced]);

  return value;
}

function useAnimatedPercent(target: number) {
  const reduced = usePrefersReducedMotion();
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (reduced) {
      setPct(target);
      return;
    }
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setPct(target));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [target, reduced]);

  return pct;
}

type StepState = "done" | "current" | "upcoming";

function stepState(step: number, current: number, complete: boolean): StepState {
  if (complete || step < current) return "done";
  if (step === current) return "current";
  return "upcoming";
}

/**
 * Same layout as the homepage dashboard preview — progress + stats + bento row.
 */
export function DashboardOverviewPanels({
  currentStep,
  totalSteps = TOTAL_WORKSHEET_STEPS,
  worksheetComplete = false,
  documentsCount,
  calendarCount = 0,
  expensesCount = 0,
  lastCompleted = null,
  nextEvent,
  welcomeName,
  variant = "live",
}: DashboardOverviewPanelsProps) {
  const { t } = useTranslation();
  const isPreview = variant === "preview";
  const total = Math.max(1, totalSteps);
  const current = clampStep(currentStep, total);
  const complete = worksheetComplete;
  const completedCount = complete ? total : Math.max(0, current - 1);
  const pct = claimProgressPercent({
    currentStep: current,
    totalSteps: total,
    worksheetComplete: complete,
    documentsCount,
    calendarCount,
    expensesCount,
  });
  const displayedPct = useAnimatedNumber(pct);
  const barPct = useAnimatedPercent(pct);
  const currentMeta = WORKSHEET_STEPS.find((s) => s.step === current);
  const currentTitle = currentMeta
    ? t(`claimForm.worksheetSteps.${currentMeta.key}`)
    : "";
  const nextMeta = WORKSHEET_STEPS.find((s) => s.step === current + 1);
  const nextTitle = nextMeta
    ? t(`claimForm.worksheetSteps.${nextMeta.key}`)
    : "";

  const ringR = 26;
  const ringC = 2 * Math.PI * ringR;
  const ringOffset = ringC * (1 - barPct / 100);

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

        <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-4 shadow-[0_24px_80px_-12px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/85 dark:shadow-[0_24px_80px_-12px_rgba(0,0,0,0.45)] sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {t("home.hero.visualProgressTitle")}
                </p>
                {!isPreview ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-teal-800 dark:border-teal-800 dark:bg-teal-950/70 dark:text-teal-200">
                    <span
                      className="claim-progress-live-dot h-1.5 w-1.5 rounded-full bg-teal-500"
                      aria-hidden
                    />
                    {t("dashboard.progress.live")}
                  </span>
                ) : null}
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {isPreview
                  ? t("home.hero.visualProgressSubtitle")
                  : complete
                    ? t("dashboard.progress.completeSubtitle")
                    : t("dashboard.progress.subtitle", {
                        current,
                        total,
                        title: currentTitle,
                      })}
              </p>
            </div>
            <div
              className="relative h-16 w-16 shrink-0"
              aria-hidden={isPreview ? true : undefined}
            >
              <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r={ringR}
                  fill="none"
                  strokeWidth="6"
                  className="stroke-slate-100 dark:stroke-slate-800"
                />
                <circle
                  cx="32"
                  cy="32"
                  r={ringR}
                  fill="none"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={ringC}
                  strokeDashoffset={ringOffset}
                  className="stroke-teal-500 transition-[stroke-dashoffset] duration-700 ease-out dark:stroke-teal-400"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[13px] font-bold tabular-nums text-teal-800 dark:text-teal-300">
                  {displayedPct}%
                </span>
              </div>
            </div>
          </div>

          <div className="mb-2 flex items-end justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
            <span>{t("home.hero.visualStepsDone")}</span>
            <span className="tabular-nums text-teal-700 dark:text-teal-400">
              {completedCount} / {total}
            </span>
          </div>
          <div
            className="relative h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
            role={isPreview ? "presentation" : "progressbar"}
            aria-hidden={isPreview ? true : undefined}
            aria-valuenow={isPreview ? undefined : pct}
            aria-valuemin={isPreview ? undefined : 0}
            aria-valuemax={isPreview ? undefined : 100}
            aria-label={isPreview ? undefined : t("home.hero.visualProgressTitle")}
          >
            <div
              className="claim-progress-bar-fill relative h-full overflow-hidden rounded-full bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-600 shadow-[0_0_20px_rgba(20,184,166,0.45)] transition-[width] duration-700 ease-out"
              style={{ width: `${barPct}%` }}
            >
              <span className="claim-progress-shimmer pointer-events-none absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            </div>
          </div>

          <ol
            className="mt-4 flex gap-1"
            aria-hidden={isPreview ? true : undefined}
            aria-label={isPreview ? undefined : t("dashboard.progress.stepsAria")}
          >
            {WORKSHEET_STEPS.map((s) => {
              const state = stepState(s.step, current, complete);
              return (
                <li key={s.step} className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block h-2 w-full rounded-full transition-colors duration-500",
                      state === "done" && "bg-teal-600 dark:bg-teal-400",
                      state === "current" &&
                        "claim-progress-current-seg bg-gradient-to-r from-teal-400 to-emerald-400",
                      state === "upcoming" && "bg-slate-200 dark:bg-slate-700",
                    )}
                    title={t(`claimForm.worksheetSteps.${s.key}`)}
                  />
                </li>
              );
            })}
          </ol>

          {!isPreview ? (
            <>
              <ol className="mt-4 grid gap-1.5 sm:grid-cols-2">
                {WORKSHEET_STEPS.map((s, index) => {
                  const state = stepState(s.step, current, complete);
                  const title = t(`claimForm.worksheetSteps.${s.key}`);
                  return (
                    <li
                      key={s.step}
                      className="claim-progress-step-in"
                      style={{ animationDelay: `${index * 45}ms` }}
                    >
                      <div
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs",
                          state === "current" &&
                            "bg-teal-50 ring-1 ring-teal-200 dark:bg-teal-950/50 dark:ring-teal-800",
                          state === "done" && "text-slate-700 dark:text-slate-200",
                          state === "upcoming" && "text-slate-400 dark:text-slate-500",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                            state === "done" &&
                              "claim-progress-check-in bg-teal-600 text-white dark:bg-teal-500",
                            state === "current" &&
                              "claim-progress-pulse-ring bg-white text-teal-700 ring-2 ring-teal-500 dark:bg-slate-900 dark:text-teal-300",
                            state === "upcoming" &&
                              "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500",
                          )}
                          aria-hidden
                        >
                          {state === "done" ? <Check className="h-3 w-3" strokeWidth={3} /> : s.step}
                        </span>
                        <span className="min-w-0 truncate font-medium">{title}</span>
                        {state === "current" ? (
                          <span className="ml-auto shrink-0 text-[10px] font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
                            {t("dashboard.progress.inProgress")}
                          </span>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-4 flex flex-col gap-3 rounded-xl border border-teal-100 bg-gradient-to-r from-teal-50/80 to-emerald-50/50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-teal-900/60 dark:from-teal-950/40 dark:to-emerald-950/20">
                <p className="min-w-0 text-xs text-slate-600 dark:text-slate-300">
                  {complete
                    ? t("dashboard.progress.completeLabel")
                    : t("dashboard.progress.currentLabel", { title: currentTitle })}
                  {!complete && nextTitle ? (
                    <span className="mt-0.5 block text-[11px] text-slate-500 dark:text-slate-400">
                      {t("dashboard.progress.upNext", { title: nextTitle })}
                    </span>
                  ) : null}
                </p>
                <Link
                  href="/claim-form"
                  className="inline-flex min-h-11 w-full shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-600 to-teal-800 px-3 py-2 text-xs font-semibold text-white shadow-sm shadow-teal-900/20 transition hover:brightness-110 sm:h-auto sm:min-h-0 sm:w-auto sm:py-1.5"
                >
                  {complete ? t("dashboard.progress.review") : t("dashboard.progress.continue")}
                </Link>
              </div>
            </>
          ) : null}

          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-5 dark:border-slate-800">
            {(
              [
                {
                  label: t("home.hero.visualStat1"),
                  value: t("dashboard.progress.statForms", {
                    done: completedCount,
                    total,
                  }),
                },
                {
                  label: t("home.hero.visualStat2"),
                  value: t("dashboard.progress.statCount", { count: documentsCount }),
                },
                {
                  label: t("home.hero.visualStat3"),
                  value: t("dashboard.progress.statCount", { count: calendarCount }),
                },
              ] as const
            ).map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg bg-slate-50/90 px-2 py-2 text-center dark:bg-slate-800/60"
              >
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
                <p className="mt-0.5 text-sm font-semibold tabular-nums text-slate-800 dark:text-slate-100">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div
            className="flex gap-4 rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white to-slate-50/90 p-4 shadow-lg backdrop-blur-sm dark:border-slate-700/80 dark:from-slate-900/90 dark:to-slate-900/60"
            role={isPreview ? undefined : "status"}
            aria-live={isPreview ? undefined : "polite"}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300">
              <CalendarClock className="h-5 w-5" aria-hidden />
            </div>
            <div
              key={`${lastCompleted?.title ?? ""}-${nextEvent?.title ?? ""}`}
              className={cn("min-w-0 flex-1", !isPreview && "claim-progress-step-in")}
            >
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                {t("home.hero.visualDeadlineTitle")}
              </p>
              <div className="mt-2 space-y-2">
                <div className="flex gap-2">
                  <span
                    className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300"
                    aria-hidden
                  >
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                  <p className="min-w-0 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-medium text-slate-500 dark:text-slate-400">
                      {t("dashboard.milestone.lastDone")}
                    </span>
                    <span className="mt-0.5 block truncate text-slate-800 dark:text-slate-100">
                      {lastCompleted
                        ? lastCompleted.title
                        : t("dashboard.milestone.noneDone")}
                    </span>
                    {lastCompleted ? (
                      <span className="mt-0.5 block text-[11px] text-slate-500 dark:text-slate-400">
                        {lastCompleted.dateLabel}
                      </span>
                    ) : null}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span
                    className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-950/70 dark:text-teal-300"
                    aria-hidden
                  >
                    <ArrowRight className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                  <p className="min-w-0 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-medium text-slate-500 dark:text-slate-400">
                      {t("dashboard.milestone.upNext")}
                    </span>
                    <span className="mt-0.5 block truncate text-slate-800 dark:text-slate-100">
                      {nextEvent
                        ? nextEvent.title
                        : t("dashboard.milestone.allCaughtUp")}
                    </span>
                    {nextEvent ? (
                      <span className="mt-0.5 block text-[11px] text-slate-500 dark:text-slate-400">
                        {nextEvent.dateLabel}
                      </span>
                    ) : null}
                  </p>
                </div>
              </div>
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
