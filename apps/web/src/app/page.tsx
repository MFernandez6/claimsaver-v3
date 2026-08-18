"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CHECKOUT_PATH } from "@claimsaver/shared";
import { Button } from "@/components/ui/button";
import FAQ from "@/components/faq";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";
import { HomeHeroVisual } from "@/components/home-hero-visual";
import { HeroLogoLockup } from "@/components/hero-logo-lockup";
import { useSupabaseUser } from "@/components/auth/use-supabase-user";
import { PitchNarrative } from "@/components/pitch-narrative";
import { LocalizedSocialImage } from "@/components/graphics/localized-social-image";
import { PricingCompare } from "@/components/pricing-compare";

export default function HomePage() {
  const { t } = useTranslation();
  const { user, isLoaded } = useSupabaseUser();

  const faqItems = [
    { question: t("home.faq.legal.question"), answer: t("home.faq.legal.answer") },
    { question: t("home.faq.accidents.question"), answer: t("home.faq.accidents.answer") },
    { question: t("home.faq.documents.question"), answer: t("home.faq.documents.answer") },
    { question: t("home.faq.states.question"), answer: t("home.faq.states.answer") },
  ];

  const proof = [
    t("proof.miami"),
    t("proof.languages"),
    t("proof.flat"),
    t("proof.notLaw"),
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-gray-900 dark:to-slate-900">
        <PageHeroBackdrop />
        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-8 pb-12 sm:px-6 sm:pt-12 sm:pb-16 lg:px-8 lg:pb-20">
          <HeroLogoLockup />
          <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20">
            <div className="text-center lg:text-left">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-200/90 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-teal-800 shadow-sm backdrop-blur-sm dark:border-teal-500/25 dark:bg-slate-900/70 dark:text-teal-200">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                {t("home.hero.eyebrow")}
              </p>
              <h1 className="mb-5 text-[2.125rem] font-bold leading-[1.1] tracking-tight text-slate-900 text-balance sm:text-5xl lg:text-[3.25rem] dark:text-white">
                <span className="block">{t("home.hero.titleLine1")} {t("home.hero.titleLine2")}</span>
                <span className="mt-3 block bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 bg-clip-text text-transparent">
                  {t("home.hero.subtitle")}
                </span>
              </h1>
              <p className="mx-auto mb-4 max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl lg:mx-0 dark:text-slate-300">
                {t("home.hero.description")}
              </p>
              <p className="mx-auto mb-8 max-w-xl text-sm text-slate-500 lg:mx-0 dark:text-slate-400">
                {t("floridaOnly.note")}
              </p>
              <div className="mb-3 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                {isLoaded && user ? (
                  <Button size="lg" asChild className="h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-800 px-7 text-base font-semibold">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 whitespace-nowrap">
                      {t("navigation.dashboard")} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button size="lg" asChild className="h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-800 px-7 text-base font-semibold">
                      <Link href={CHECKOUT_PATH} className="inline-flex items-center gap-2 whitespace-nowrap">
                        {t("cta.primary")} <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="h-12 rounded-xl border-2 px-7 text-base font-semibold">
                      <Link href="/how-it-works">{t("cta.secondary")}</Link>
                    </Button>
                  </>
                )}
              </div>
              {!(isLoaded && user) ? (
                <p className="mb-8 text-sm font-medium text-slate-500 lg:text-left">{t("cta.path")}</p>
              ) : (
                <div className="mb-8" />
              )}
              <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-slate-600 lg:justify-start dark:text-slate-300">
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
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t("floridaOnly.chip")} · {t("pricing.ui.comparisonTitleLead")} {t("pricing.ui.comparisonTitleAccent")}
          </p>
          <PricingCompare ctaHref="/pricing" ctaLabel={t("cta.payAccess")} />
          <p className="mt-4 text-center text-xs text-slate-500">{t("pricing.comparisonNote")}</p>
          <p className="mt-3 text-center text-sm text-slate-500">
            {t("home.notaryNote")}{" "}
            <Link href="/notarization" className="font-medium text-teal-800 underline underline-offset-2 dark:text-teal-300">
              {t("home.optionalServices.linkNotarization")}
            </Link>
          </p>
        </div>
      </section>

      <section className="border-y border-slate-200/70 bg-slate-50/90 py-16 dark:border-slate-800/60 dark:bg-slate-950/40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <h2 className="mb-3 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
              {t("home.story.pipStepsTitle")}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              {t("home.story.pipStepsSubtitle")}
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <LocalizedSocialImage
              baseName="week1-wed-pip-5-steps"
              alt={t("home.story.pipStepsAlt")}
              width={1600}
              height={900}
              className="h-auto w-full object-cover"
            />
          </div>
          <p className="mt-3 text-center text-xs text-slate-500">{t("home.graphicCaption")}</p>
        </div>
      </section>

      <FAQ title={t("home.faq.title")} subtitle={t("home.faq.subtitle")} items={faqItems} />
    </div>
  );
}
