"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { addDays, daysUntil } from "@claimsaver/shared";
import { articlePath } from "@/data/learningCenter/slugs";

export function PipDeadlineBanner({ accidentDate }: { accidentDate: string }) {
  const { t } = useTranslation();
  if (!accidentDate) return null;
  const day14 = addDays(accidentDate, 14);
  const remaining = daysUntil(day14);

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-50">
      <p className="font-semibold">{t("deadlines.fourteenTitle")}</p>
      <p className="mt-1 leading-relaxed">
        {remaining >= 0
          ? t("deadlines.fourteenCountdown", { date: day14, days: remaining })
          : t("deadlines.fourteenPassed", { date: day14 })}
      </p>
      <p className="mt-1 text-xs leading-relaxed opacity-80">{t("deadlines.education")}</p>
      <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold">
        <Link href={articlePath("fourteenDay")} className="underline underline-offset-2">
          {t("fourteenDay.link")}
        </Link>
        <Link href="/dashboard" className="underline underline-offset-2">
          {t("deadlines.seeCalendar")}
        </Link>
      </p>
    </div>
  );
}
