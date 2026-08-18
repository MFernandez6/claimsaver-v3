"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  ILLUSTRATIVE_CONTINGENCY_FEE_CENTS,
  PLATFORM_PRICE_TESTING,
  PRODUCTS,
} from "@claimsaver/shared";
import { Button } from "@/components/ui/button";
import { formatUsd } from "@/lib/utils";

export function PricingCompare({
  ctaHref,
  ctaLabel,
}: {
  ctaHref?: string;
  ctaLabel?: string;
}) {
  const { t } = useTranslation();

  return (
    <div className="grid items-stretch gap-5 md:grid-cols-2">
      <article className="rounded-2xl border border-rose-200/90 bg-rose-50/80 p-6 dark:border-rose-900/50 dark:bg-rose-950/25">
        <h3 className="text-base font-semibold leading-snug text-rose-800 dark:text-rose-200">
          {t("pricing.traditionalCosts.title")}
        </h3>
        <p className="mt-5 text-3xl font-semibold tracking-tight text-rose-700 dark:text-rose-300">
          {formatUsd(ILLUSTRATIVE_CONTINGENCY_FEE_CENTS)}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-rose-800/80 dark:text-rose-200/80">
          {t("pricing.traditionalCosts.attorneyFee")}
        </p>
        <p className="mt-3 text-xs leading-relaxed text-rose-700/70 dark:text-rose-300/70">
          {t("pricing.traditionalCosts.averagePolicy")}
        </p>
      </article>

      <article className="relative overflow-hidden rounded-2xl border border-emerald-300/90 bg-emerald-50/80 p-6 shadow-sm dark:border-emerald-700/60 dark:bg-emerald-950/30">
        <span className="absolute right-0 top-0 origin-top-right translate-x-[30%] translate-y-[40%] rotate-45 bg-emerald-600 px-10 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-sm dark:bg-emerald-500">
          {t("pricing.ui.recommendedBadge")}
        </span>
        <h3 className="pr-16 text-base font-semibold leading-snug text-emerald-800 dark:text-emerald-200">
          {t("pricing.claimSaverAdvantages.title")}
        </h3>
        <p className="mt-5 text-3xl font-semibold tracking-tight text-emerald-700 dark:text-emerald-300">
          {PRODUCTS.platform.listDisplayPrice}
        </p>
        {PLATFORM_PRICE_TESTING ? (
          <p className="mt-1 text-xs font-medium text-teal-800 dark:text-teal-200">
            {t("pricing.testing.compareNote", { testPrice: PRODUCTS.platform.displayPrice })}
          </p>
        ) : null}
        <p className="mt-2 text-sm leading-relaxed text-emerald-900/80 dark:text-emerald-100/80">
          {t("pricing.claimSaverAdvantages.noContingency")}
        </p>
        <p className="mt-3 text-xs leading-relaxed text-emerald-800/70 dark:text-emerald-200/70">
          {t("pricing.ui.advantageCallout")}
        </p>
        {ctaHref && ctaLabel ? (
          <div className="mt-5">
            <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-800">
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          </div>
        ) : null}
      </article>
    </div>
  );
}
