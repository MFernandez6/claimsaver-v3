"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { CHECKOUT_PATH, FOUNDER } from "@claimsaver/shared";
import { BrandLogo } from "@/components/brand-logo";
import { ObfuscatedSupportEmail } from "@/components/obfuscated-support-email";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 text-white print:hidden">
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden>
        <div
          className="absolute inset-0 bg-no-repeat bg-center"
          style={{ backgroundImage: "url('/images/brand/claimsaver-plus-mark.png')", backgroundSize: "min(280px, 40vw)" }}
        />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-1">
            <BrandLogo variant="footer" />
            <p className="mt-4 text-sm text-teal-100/80">
              {t("footer.description")}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-teal-200">{t("floridaOnly.chip")}</p>
            <p className="mt-1 text-sm text-white/70">{t("floridaOnly.note")}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-teal-200">{t("footer.services")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li><Link href={CHECKOUT_PATH} className="hover:text-white">{t("cta.primary")}</Link></li>
              <li><Link href="/pricing" className="hover:text-white">{t("navigation.pricing")}</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white">{t("navigation.howItWorks")}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-teal-200">{t("footer.company")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li><Link href="/who-we-are" className="hover:text-white">{t("navigation.whoWeAre")}</Link></li>
              <li><Link href="/contact" className="hover:text-white">{t("navigation.contact")}</Link></li>
              <li><Link href="/learning-center" className="hover:text-white">{t("navigation.learningCenter")}</Link></li>
              <li><Link href="/when-to-call-an-attorney" className="hover:text-white">{t("navigation.needProfessionalHelp")}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-teal-200">{t("footer.legal")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li><Link href="/data-handling" className="hover:text-white">{t("navigation.dataHandling")}</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white">{t("common.privacyPolicy")}</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-white">{t("common.termsOfService")}</Link></li>
              <li><Link href="/accessibility" className="hover:text-white">{t("common.accessibility")}</Link></li>
            </ul>
            <p className="mt-4 text-sm text-white/70">
              {t("footer.emailSupport")} <ObfuscatedSupportEmail className="underline" />
            </p>
          </div>
        </div>
        <p className="mt-10 text-xs leading-relaxed text-white/60">{t("footer.legalText")}</p>
        <p className="mt-3 text-xs text-white/55">
          {t("footer.licenseLine", {
            name: FOUNDER.name,
            type: FOUNDER.licenseType,
            number: FOUNDER.licenseNumber,
          })}
        </p>
        <p className="mt-4 text-xs text-white/50">© {new Date().getFullYear()} CLAIMSAVERPLUS LLC d/b/a ClaimSaver+ • {t("footer.servingFlorida")}</p>
      </div>
    </footer>
  );
}
