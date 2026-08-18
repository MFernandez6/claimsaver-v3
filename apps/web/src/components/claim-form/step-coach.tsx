"use client";

import Link from "next/link";
import { Lightbulb } from "lucide-react";
import { useTranslation } from "react-i18next";

export function StepCoach({ step }: { step: number }) {
  const { t } = useTranslation();
  const key = `s${step}` as const;

  return (
    <aside className="space-y-3 rounded-2xl border border-teal-200/80 bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">
        {t("claimForm.coach.badge")}
      </p>
      <h2 className="text-lg font-semibold text-slate-900">{t(`claimForm.coach.${key}.title`)}</h2>
      <p className="text-sm leading-snug text-slate-600">{t(`claimForm.coach.${key}.body`)}</p>
      <div className="flex gap-2 text-sm text-slate-700">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
        <p>{t(`claimForm.coach.${key}.tip`)}</p>
      </div>
      <p className="text-xs text-slate-500">{t("claimForm.coach.notAdvice")}</p>
      <p className="text-xs">
        <Link href="/learning-center" className="text-teal-800 underline">
          {t("claimForm.coach.learnMore")}
        </Link>
      </p>
    </aside>
  );
}
