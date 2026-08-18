"use client";

import Link from "next/link";
import { BookOpen, Lightbulb, ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

export function StepCoach({ step }: { step: number }) {
  const { t } = useTranslation();
  const key = `s${step}` as const;

  return (
    <aside className="space-y-3 rounded-2xl border border-teal-200/80 bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-5 shadow-sm">
      <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-teal-800">
        <BookOpen className="h-3.5 w-3.5" aria-hidden />
        {t("claimForm.coach.badge")}
      </p>
      <h2 className="text-lg font-semibold text-slate-900">{t(`claimForm.coach.${key}.title`)}</h2>
      <p className="text-sm leading-relaxed text-slate-600">{t(`claimForm.coach.${key}.body`)}</p>
      <div className="rounded-xl border border-teal-200 bg-white/80 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">{t("claimForm.coach.statLabel")}</p>
        <p className="mt-1 text-sm font-medium text-slate-800">{t(`claimForm.coach.${key}.stat`)}</p>
        <p className="mt-1 text-xs text-slate-500">{t("claimForm.coach.statNote")}</p>
      </div>
      <div className="flex gap-2 text-sm text-slate-700">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
        <p>{t(`claimForm.coach.${key}.tip`)}</p>
      </div>
      <div className="flex gap-2 text-xs text-slate-500">
        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        <p>{t("claimForm.coach.notAdvice")}</p>
      </div>
      <p className="text-xs">
        <Link href="/learning-center" className="text-teal-800 underline">
          {t("claimForm.coach.learnMore")}
        </Link>
        {" · "}
        <Link href="/when-to-call-an-attorney" className="text-slate-500 underline">
          {t("navigation.needProfessionalHelp")}
        </Link>
      </p>
    </aside>
  );
}
