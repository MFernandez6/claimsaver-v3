"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { START_PATH } from "@claimsaver/shared";
import { Button } from "@/components/ui/button";
import FAQ from "@/components/faq";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";
import { HomeHeroVisual } from "@/components/home-hero-visual";
import { HeroLogoLockup } from "@/components/hero-logo-lockup";
import { useSignedInHome } from "@/components/auth/use-signed-in-home";
import { PitchNarrative } from "@/components/pitch-narrative";
import { PricingCompare } from "@/components/pricing-compare";
import { NamedProofSection, ThirdPartyStrip, TrustCtaNote } from "@/components/trust-signals";
import { ProductPreview } from "@/components/product-preview";
import { LAWYER_DECLINED_PATH } from "@/lib/seo/paths";

export function HomePage() {
  const { t } = useTranslation();
  const { user, isLoaded, home, staffReady } = useSignedInHome();

  const faqItems = [
    { question: t("home.faq.legal.question"), answer: t("home.faq.legal.answer") },
    { question: t("home.faq.lawFirm.question"), answer: t("home.faq.lawFirm.answer") },
    {
      question: t("home.faq.attorneyNeed.question"),
      answer: (
        <>
          {t("home.faq.attorneyNeed.answer")}{" "}
          <Link href={LAWYER_DECLINED_PATH} className="font-semibold text-teal-800 underline underline-offset-2">
            {t("pages.lawyerDeclined.navLink")}
          </Link>
        </>
      ),
    },
    { question: t("home.faq.vsAttorney.question"), answer: t("home.faq.vsAttorney.answer") },
    { question: t("home.faq.duration.question"), answer: t("home.faq.duration.answer") },
    {
      question: t("home.faq.cost.question"),
      answer: (
        <>
          {t("copy.patientPrice.short")}{" "}
          <Link href="/clinic-demo" className="font-semibold text-teal-800 underline underline-offset-2">
            {t("home.faq.cost.clinicLink")}
          </Link>
        </>
      ),
    },
    { question: t("home.faq.accidents.question"), answer: t("home.faq.accidents.answer") },
    { question: t("home.faq.documents.question"), answer: t("home.faq.documents.answer") },
    { question: t("home.faq.ifYouStop.question"), answer: t("home.faq.ifYouStop.answer") },
    {
      question: t("home.faq.refund.question"),
      answer: (
        <>
          {t("home.faq.refund.answer")}{" "}
          <Link href="/terms-of-service#section-5" className="font-semibold text-teal-800 underline underline-offset-2">
            {t("cta.refundTermsLink")}
          </Link>
        </>
      ),
    },
  ];

  const proof = [
    t("home.hero.founderCredential"),
    t("proof.miami"),
    t("proof.languages"),
    t("proof.flat"),
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-gray-900 dark:to-slate-900">
        <PageHeroBackdrop />
        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-4 pb-12 sm:px-6 sm:pt-12 sm:pb-16 lg:px-8 lg:pb-20">
          <HeroLogoLockup />
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20">
            <div className="text-center lg:text-left">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-200/90 bg-white/70 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-teal-800 shadow-sm backdrop-blur-sm sm:mb-4 sm:px-4 sm:text-xs sm:tracking-[0.2em] dark:border-teal-500/25 dark:bg-slate-900/70 dark:text-teal-200">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                {t("home.hero.eyebrow")}
              </p>
              <h1 className="mb-2 text-3xl font-bold leading-[1.1] tracking-tight text-slate-900 text-balance sm:mb-3 sm:text-5xl lg:text-[3.25rem] dark:text-white">
                <span className="mb-2 block text-base font-semibold leading-snug text-teal-800 sm:mb-3 sm:text-xl dark:text-teal-200">
                  {t("home.hero.urgency")}
                </span>
                <span className="block">{t("home.hero.titleLine1")} {t("home.hero.titleLine2")}</span>
              </h1>
              <p className="mb-2 text-lg font-semibold leading-snug text-slate-800 sm:mb-3 sm:text-2xl dark:text-slate-100">
                {t("home.hero.subtitle")}
              </p>
              <p className="mb-3 text-base font-semibold leading-snug text-slate-900 sm:mb-4 sm:text-xl dark:text-white">
                {t("home.hero.trustSpine")}
              </p>
              <p className="mx-auto mb-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-xl lg:mx-0 dark:text-slate-300">
                {t("home.hero.description")}
              </p>
              <div className="mb-3 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                {isLoaded && user ? (
                  staffReady ? (
                    <Button size="lg" asChild className="h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-800 px-7 text-base font-semibold">
                      <Link href={home.href} className="inline-flex items-center gap-2 whitespace-nowrap">
                        {t(home.labelKey)} <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <span className="inline-block h-12 w-48" aria-hidden />
                  )
                ) : (
                  <>
                    <Button size="lg" asChild className="h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-800 px-7 text-base font-semibold">
                      <Link href={START_PATH} className="inline-flex items-center gap-2 whitespace-nowrap">
                        {t("cta.payAccess")} <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="h-12 rounded-xl border-2 px-7 text-base font-semibold">
                      <Link href="/how-it-works">{t("cta.secondary")}</Link>
                    </Button>
                  </>
                )}
              </div>
              {!(isLoaded && user) ? (
                <TrustCtaNote className="mx-auto mb-3 max-w-xl lg:mx-0" />
              ) : (
                <div className="mb-2" />
              )}
              <ul className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-slate-600 lg:justify-start dark:text-slate-300">
                {proof.map((line) => (
                  <li key={line} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <HomeHeroVisual />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 py-16 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(45,212,191,0.18),transparent_55%)]" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <PitchNarrative tone="dark" />
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <h2 className="mb-3 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
              {t("pricing.ui.comparisonTitleLead")}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              {t("pricing.ui.comparisonSubtitle")}
            </p>
            <p className="mt-3">
              <Link href={LAWYER_DECLINED_PATH} className="font-semibold text-teal-800 underline underline-offset-2">
                {t("pages.lawyerDeclined.navLink")}
              </Link>
            </p>
          </div>
          <PricingCompare ctaHref={START_PATH} ctaLabel={t("cta.payAccess")} />
        </div>
      </section>

      <ProductPreview />

      <NamedProofSection />

      <FAQ
        title={t("home.faq.title")}
        subtitle={t("home.faq.subtitle")}
        items={faqItems}
        defaultOpenIndexes={[0]}
      />
      <ThirdPartyStrip />
    </div>
  );
}
