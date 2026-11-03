"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { LEGAL_ENTITY_DISPLAY, PRINCIPAL_ADDRESS_LINE, SUNBIZ_DOCUMENT_NUMBER } from "@claimsaver/shared";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";

export default function LicenseCredentialsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <section className="relative overflow-hidden pt-28 pb-20">
        <PageHeroBackdrop />
        <div className="relative z-10 mx-auto max-w-3xl px-4">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            {t("pages.licenseCredentials.title")}
          </h1>
          <p className="mt-3 text-xl text-teal-800 dark:text-teal-300">
            {t("pages.licenseCredentials.subtitle")}
          </p>
          <p className="mt-6 leading-relaxed text-slate-600 dark:text-slate-300">
            {t("pages.licenseCredentials.body")}
          </p>
          <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
            {t("pages.licenseCredentials.optionalPA")}
          </p>

          <h2 className="mt-10 text-2xl font-semibold text-slate-900 dark:text-white">
            {t("pages.licenseCredentials.staffLicenseHeading")}
          </h2>
          <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
            {t("pages.licenseCredentials.staffLicenseBody")}
          </p>
          <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
            {t("pages.licenseCredentials.staffLicensePending")}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            {t("pages.licenseCredentials.unsupportedNote")}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            {t("pages.licenseCredentials.verify")}
          </p>
          <p className="mt-6 text-sm text-slate-500">
            {LEGAL_ENTITY_DISPLAY}
            <br />
            {PRINCIPAL_ADDRESS_LINE}
            <br />
            {t("pages.licenseCredentials.sunbizLine", { document: SUNBIZ_DOCUMENT_NUMBER })}
          </p>
          <p className="mt-3 text-sm text-slate-500">
            {t("pages.licenseCredentials.searchHint")}
          </p>
          <p className="mt-4 text-sm">
            <Link href="/who-we-are" className="text-teal-800 underline dark:text-teal-300">
              {t("navigation.whoWeAre")}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
