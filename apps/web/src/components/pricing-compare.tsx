"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { PLATFORM_PRICE_TESTING, PRODUCTS } from "@claimsaver/shared";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ROWS = ["why", "who", "fee"] as const;

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
      <div className="grid items-stretch gap-5 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900/70">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t("pricing.fit.colAttorney")}
          </p>
          <ComparisonRows side="Attorney" />
        </article>

        <article className="flex flex-col rounded-2xl border border-teal-200 bg-white p-6 dark:border-teal-800 dark:bg-slate-900/70">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-800 dark:text-teal-300">
            {t("pricing.fit.colOurs")}
          </p>
          <ComparisonRows side="Ours" />
          {PLATFORM_PRICE_TESTING ? (
            <p className="mt-3 text-xs font-medium text-teal-800 dark:text-teal-200">
              {t("pricing.testing.compareNote", { testPrice: PRODUCTS.platform.displayPrice })}
            </p>
          ) : null}
          {ctaHref && ctaLabel ? (
            <div className="mt-5">
              <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-800">
                <Link href={ctaHref}>{ctaLabel}</Link>
              </Button>
            </div>
          ) : null}
        </article>
      </div>
      <p className="mt-4 text-center text-xs leading-relaxed text-slate-500">
        {t("pricing.fit.footnote")}
      </p>
    </div>
  );
}

function ComparisonRows({ side }: { side: "Attorney" | "Ours" }) {
  const { t } = useTranslation();
  const valueClass =
    side === "Ours"
      ? "text-slate-800 dark:text-slate-100"
      : "text-slate-700 dark:text-slate-200";

  return (
    <dl className="mt-5 space-y-4">
      {ROWS.map((row) => (
        <div
          key={row}
          className={cn(
            "border-t pt-4 first:border-t-0 first:pt-0",
            side === "Ours" ? "border-teal-100 dark:border-teal-900" : "border-slate-100 dark:border-slate-800",
          )}
        >
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            {t(`pricing.fit.${row}`)}
          </dt>
          <dd className={cn("mt-1 text-sm leading-relaxed", valueClass)}>
            {t(`pricing.fit.${row}${side}`)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
