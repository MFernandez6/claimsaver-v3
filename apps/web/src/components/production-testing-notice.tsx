"use client";

import { useTranslation } from "react-i18next";
import { PLATFORM_LIST_DISPLAY_PRICE, PLATFORM_PRICE_TESTING, PRODUCTS } from "@claimsaver/shared";

export function ProductionTestingNotice({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();
  if (!PLATFORM_PRICE_TESTING) return null;

  return (
    <div
      className={
        compact
          ? "rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-950"
          : "border-b border-teal-200/90 bg-teal-50 text-teal-950 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-50"
      }
      role="status"
    >
      <div className={compact ? undefined : "mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8"}>
        <p className={compact ? "leading-relaxed" : "text-sm leading-relaxed"}>
          <span className="font-semibold">{t("pricing.testing.kicker")}</span>{" "}
          {t("pricing.testing.body", {
            testPrice: PRODUCTS.platform.displayPrice,
            listPrice: PLATFORM_LIST_DISPLAY_PRICE,
          })}
        </p>
      </div>
    </div>
  );
}
