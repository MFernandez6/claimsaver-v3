"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PLATFORM_PRICE_TESTING, PRODUCTS } from "@claimsaver/shared";
import { Button } from "@/components/ui/button";

const ROWS = ["why", "fee"] as const;

export function PricingCompare({
  ctaHref,
  ctaLabel,
}: {
  ctaHref?: string;
  ctaLabel?: string;
}) {
  const { t } = useTranslation();

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <div className="grid md:grid-cols-2">
          <article className="border-b border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-emerald-50/70 p-6 sm:p-8 md:border-b-0 md:border-r dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-teal-950/30">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl">
              {t("pricing.fit.colAttorney")}
            </h3>
            <ComparisonRows side="Attorney" />
          </article>

          <article className="bg-gradient-to-br from-slate-50 via-white to-emerald-50/70 p-6 sm:p-8 dark:from-slate-900 dark:via-slate-900 dark:to-teal-950/30">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl">
              {t("pricing.fit.colOurs")}
            </h3>
            <ComparisonRows side="Ours" />
            <p className="mt-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {t("pricing.fit.anchorEcho")}
            </p>
            {PLATFORM_PRICE_TESTING ? (
              <p className="mt-6 text-sm font-medium text-teal-800 dark:text-teal-200">
                {t("pricing.testing.compareNote", { testPrice: PRODUCTS.platform.displayPrice })}
              </p>
            ) : null}
          </article>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-slate-500">{t("pricing.fit.footnote")}</p>
      {ctaHref && ctaLabel ? (
        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            asChild
            className="h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-800 px-7 text-base font-semibold"
          >
            <Link href={ctaHref} className="inline-flex items-center gap-2 whitespace-nowrap">
              {ctaLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function ComparisonRows({ side }: { side: "Attorney" | "Ours" }) {
  const { t } = useTranslation();

  return (
    <dl className="mt-6 space-y-5">
      {ROWS.map((row) => (
        <div key={row}>
          <dt className="text-sm font-semibold text-teal-800 dark:text-teal-300">
            {t(`pricing.fit.${row}`)}
          </dt>
          <dd className="mt-1 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {t(`pricing.fit.${row}${side}`)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
