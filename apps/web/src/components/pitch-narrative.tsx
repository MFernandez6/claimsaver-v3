"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

/**
 * Customer-facing version of the founder pitch.
 * 14-day language is education, not a determination. Reminders are not legal deadlines.
 * Licensed-adjuster line is founder background—not representation.
 */
export function PitchNarrative({
  compact = false,
  tone = "light",
}: {
  compact?: boolean;
  tone?: "light" | "dark";
}) {
  const { t } = useTranslation();
  const dark = tone === "dark";

  return (
    <div className={cn(compact ? "space-y-5" : "space-y-8")}>
      <div>
        {!compact ? (
          <p
            className={cn(
              "mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em]",
              dark ? "text-teal-300" : "text-teal-800 dark:text-teal-300",
            )}
          >
            {t("pitch.eyebrow")}
          </p>
        ) : null}
        <h2
          className={cn(
            "text-2xl font-bold tracking-tight sm:text-3xl",
            !compact && "text-center text-balance",
            dark ? "text-white" : "text-slate-900 dark:text-white",
          )}
        >
          {t("pitch.title")}
        </h2>
      </div>

      <p
        className={cn(
          "text-lg leading-relaxed",
          dark ? "text-slate-200" : "text-slate-700 dark:text-slate-300",
        )}
      >
        {t("pitch.body1")}
      </p>
      <p className={cn("text-sm", dark ? "text-slate-400" : "text-slate-500")}>
        {t("pitch.fourteenDayNote")}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div
          className={cn(
            "rounded-2xl border p-5",
            dark
              ? "border-white/15 bg-white/10"
              : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/70",
          )}
        >
          <p className={cn("text-xs font-semibold uppercase tracking-wide", dark ? "text-slate-400" : "text-slate-500")}>
            {t("pitch.optionOneLabel")}
          </p>
          <p className={cn("mt-2 font-semibold", dark ? "text-white" : "text-slate-900 dark:text-white")}>
            {t("pitch.optionOneTitle")}
          </p>
          <p className={cn("mt-2 text-sm leading-relaxed", dark ? "text-slate-300" : "text-slate-600 dark:text-slate-300")}>
            {t("pitch.optionOneBody")}
          </p>
        </div>
        <div
          className={cn(
            "rounded-2xl border p-5",
            dark
              ? "border-white/15 bg-white/10"
              : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/70",
          )}
        >
          <p className={cn("text-xs font-semibold uppercase tracking-wide", dark ? "text-slate-400" : "text-slate-500")}>
            {t("pitch.optionTwoLabel")}
          </p>
          <p className={cn("mt-2 font-semibold", dark ? "text-white" : "text-slate-900 dark:text-white")}>
            {t("pitch.optionTwoTitle")}
          </p>
          <p className={cn("mt-2 text-sm leading-relaxed", dark ? "text-slate-300" : "text-slate-600 dark:text-slate-300")}>
            {t("pitch.optionTwoBody")}
          </p>
        </div>
      </div>

      <p
        className={cn(
          "text-lg leading-relaxed",
          dark ? "text-slate-200" : "text-slate-700 dark:text-slate-300",
        )}
      >
        {t("pitch.middlePath")}
      </p>

      <p className={cn("text-sm leading-relaxed", dark ? "text-slate-400" : "text-slate-600 dark:text-slate-400")}>
        {t("pitch.founder")}{" "}
        <Link
          href="/when-to-call-an-attorney"
          className={cn("underline", dark ? "text-teal-200" : "text-teal-800 dark:text-teal-300")}
        >
          {t("pitch.attorneyLink")}
        </Link>
      </p>
    </div>
  );
}
