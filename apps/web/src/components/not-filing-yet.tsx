"use client";

import { useTranslation } from "react-i18next";

export function NotFilingYet() {
  const { t } = useTranslation();
  return (
    <div
      role="status"
      className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-950 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-50"
    >
      <p className="font-semibold">{t("notFiling.title")}</p>
      <p className="mt-1 leading-relaxed">{t("notFiling.body")}</p>
    </div>
  );
}
