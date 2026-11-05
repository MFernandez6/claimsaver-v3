"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { CHECKOUT_PATH, PRINCIPAL_ADDRESS_LINE } from "@claimsaver/shared";
import { BrandLogo } from "@/components/brand-logo";
import { ObfuscatedSupportEmail } from "@/components/obfuscated-support-email";
import { useSignedInHome } from "@/components/auth/use-signed-in-home";

export default function Footer() {
  const { t } = useTranslation();
  const { isSignedIn, home } = useSignedInHome();

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
            <p className="mt-4 text-sm leading-relaxed text-teal-100/80">
              {t("footer.description")}
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-100">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
              {t("floridaOnly.chip")}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{t("floridaOnly.note")}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-teal-200">{t("footer.services")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li>
                {isSignedIn ? (
                  <Link href={home.href} className="hover:text-white">{t(home.labelKey)}</Link>
                ) : (
                  <Link href={CHECKOUT_PATH} className="hover:text-white">{t("cta.primary")}</Link>
                )}
              </li>
              <li><Link href="/pricing" className="hover:text-white">{t("navigation.pricing")}</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white">{t("navigation.howItWorks")}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-teal-200">{t("footer.company")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li><Link href="/who-we-are" className="hover:text-white">{t("navigation.whoWeAre")}</Link></li>
              <li><Link href="/for-clinics" className="hover:text-white">{t("navigation.forClinics")}</Link></li>
              <li><Link href="/license-credentials" className="hover:text-white">{t("navigation.licenseCredentials")}</Link></li>
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
        <div className="mt-4 text-center text-xs text-white/50">
          <p>© {new Date().getFullYear()} CLAIMSAVERPLUS LLC d/b/a ClaimSaver+</p>
          <p className="mt-1">{PRINCIPAL_ADDRESS_LINE}</p>
          <p className="mt-1">{t("footer.servingFlorida")}</p>
        </div>
      </div>
    </footer>
  );
}
