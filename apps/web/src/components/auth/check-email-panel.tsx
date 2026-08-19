"use client";

import { Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BrandLogo } from "@/components/brand-logo";
import { FlashNotice } from "@/components/flash-notice";

type CheckEmailPanelProps = {
  email: string;
};

export function CheckEmailPanel({ email }: CheckEmailPanelProps) {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
      <FlashNotice message={t("auth.checkEmailNotice")} />
      <div className="rounded-2xl border border-teal-200 bg-teal-50 p-6 text-teal-950 shadow-sm" role="status">
        <BrandLogo className="mb-4" />
        <Mail className="h-8 w-8 text-teal-700" aria-hidden />
        <h1 className="mt-3 text-2xl font-bold">{t("auth.checkEmailTitle")}</h1>
        <p className="mt-3 text-sm leading-relaxed">{t("auth.checkEmailBody", { email })}</p>
        <div className="mt-5 rounded-xl border border-teal-200 bg-white p-4 text-left shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-teal-800">
            {t("auth.checkEmailLookFor")}
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">{t("auth.checkEmailSubject")}</p>
          <p className="mt-1 text-sm text-slate-500">{t("auth.checkEmailFromLine")}</p>
        </div>
        <p className="mt-4 text-sm text-teal-800">{t("auth.checkEmailSpam")}</p>
      </div>
    </div>
  );
}
