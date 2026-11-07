"use client";

import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

const INCLUDED = [1, 2, 3, 4, 5, 6, 7] as const;

export function PricingOffer() {
  const { t } = useTranslation();

  return (
    <article
      data-pricing-offer="platform"
      className="relative mt-10 overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-white to-emerald-50/70 p-6 shadow-lg sm:p-8 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-teal-950/40"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-600 to-teal-800"
        aria-hidden
      />
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-800 dark:text-teal-300">
        {t("pricing.offer.kicker")}
      </p>
      <p className="mt-3 text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
        {t("pricing.offer.priceLine")}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">{t("pricing.offer.perFiler")}</p>
      <p className="mt-3 text-base font-semibold text-slate-800 dark:text-slate-100">
        {t("pricing.offer.noPercentage")}
      </p>
      <h2 className="mt-7 text-lg font-semibold text-slate-900 dark:text-white">{t("pricing.offer.includedTitle")}</h2>
      <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
        {INCLUDED.map((n) => (
          <li key={n} className="flex gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-emerald-800 text-white">
              <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
            </span>
            <span>{t(`pages.howItWorks.include${n}Title`)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-xs text-slate-500">{t("pricing.offer.forSaleToday")}</p>
    </article>
  );
}

export function PricingValueTable() {
  const { t } = useTranslation();

  return (
    <section className="mt-12" data-pricing-compare="value-anchor">
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t("pricing.vs.title")}</h2>
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="bg-gradient-to-r from-slate-50 via-white to-emerald-50/80 text-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-teal-950/40 dark:text-slate-200">
              <tr>
                <th className="w-32 px-4 py-3.5 font-semibold">{t("pricing.vs.compare")}</th>
                <th className="px-4 py-3.5 font-semibold">{t("pricing.vs.colFirm")}</th>
                <th className="px-4 py-3.5 font-semibold">{t("pricing.vs.colSub")}</th>
                <th className="bg-teal-50 px-4 py-3.5 font-semibold text-teal-900 dark:bg-teal-950/50 dark:text-teal-100">
                  {t("pricing.vs.colOurs")}
                </th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300">
              <tr className="border-t border-slate-200 dark:border-slate-700">
                <th className="px-4 py-3.5 align-top font-medium text-slate-800 dark:text-slate-100">
                  {t("pricing.vs.howLabel")}
                </th>
                <td className="px-4 py-3.5 align-top">{t("pricing.vs.howFirm")}</td>
                <td className="px-4 py-3.5 align-top">{t("pricing.vs.howSub")}</td>
                <td className="bg-teal-50/70 px-4 py-3.5 align-top font-medium text-slate-900 dark:bg-teal-950/20 dark:text-white">
                  {t("pricing.vs.howOurs")}
                </td>
              </tr>
              <tr className="border-t border-slate-200 dark:border-slate-700">
                <th className="px-4 py-3.5 align-top font-medium text-slate-800 dark:text-slate-100">
                  {t("pricing.vs.whatLabel")}
                </th>
                <td className="px-4 py-3.5 align-top">{t("pricing.vs.whatFirm")}</td>
                <td className="px-4 py-3.5 align-top">{t("pricing.vs.whatSub")}</td>
                <td className="bg-teal-50/70 px-4 py-3.5 align-top dark:bg-teal-950/20">{t("pricing.vs.whatOurs")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">{t("pricing.vs.note")}</p>
    </section>
  );
}
