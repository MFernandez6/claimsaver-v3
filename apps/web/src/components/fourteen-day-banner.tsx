"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { articlePath } from "@/data/learningCenter/slugs";

const STORAGE_KEY = "claimsaver:fourteen-day-banner-dismissed";

const HIDDEN = [
  "/dashboard",
  "/claim-form",
  "/admin",
  "/login",
  "/signup",
  "/checkout-account",
  "/success",
  "/forgot-password",
  "/update-password",
];

export function FourteenDayBanner() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(window.localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  if (dismissed || HIDDEN.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }

  function dismiss() {
    window.localStorage.setItem(STORAGE_KEY, "1");
    setDismissed(true);
  }

  return (
    <div className="border-b border-amber-200/90 bg-amber-50 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-50">
      <div className="mx-auto flex max-w-7xl items-start gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p className="text-sm leading-relaxed">
            <span className="font-semibold">{t("fourteenDay.banner")}</span>{" "}
            {t("fourteenDay.body")}
          </p>
          <p className="flex shrink-0 flex-wrap gap-x-4 gap-y-1 text-sm font-semibold">
            <Link href={articlePath("fourteenDay")} className="underline underline-offset-2 hover:text-amber-800 dark:hover:text-amber-200">
              {t("fourteenDay.link")}
            </Link>
            <Link href="/when-to-call-an-attorney" className="underline underline-offset-2 hover:text-amber-800 dark:hover:text-amber-200">
              {t("fourteenDay.attorney")}
            </Link>
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-amber-800 hover:bg-amber-100 dark:text-amber-100 dark:hover:bg-amber-900/60"
          aria-label={t("common.close")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
