"use client";

import { PageHeroBackdrop } from "@/components/page-hero-backdrop";
import { ObfuscatedSupportEmail } from "@/components/obfuscated-support-email";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function ContactPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden pt-28 pb-20">
        <PageHeroBackdrop />
        <div className="relative z-10 mx-auto max-w-3xl px-4">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{t("pages.contact.title")}</h1>
          <p className="mt-4 text-slate-600">
            {t("pages.contact.body")}
          </p>
          <p className="mt-6">{t("pages.contact.emailLabel")}: <ObfuscatedSupportEmail className="font-medium text-teal-800" /></p>
          <p className="mt-2 text-sm text-slate-500">{t("pages.contact.headquarters")}</p>
          <p className="mt-6 text-sm">
            <Link href="/when-to-call-an-attorney" className="underline">{t("pages.contact.attorneyCta")}</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
