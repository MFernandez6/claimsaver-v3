"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { PLATFORM_PRICE_TESTING, PRODUCTS, SKIP_PAYMENTS_FOR_PROMO } from "@claimsaver/shared";
import { ProductionTestingNotice } from "@/components/production-testing-notice";
import { AgeTermsConsent } from "@/components/auth/age-terms-consent";
import { PricingCompare } from "@/components/pricing-compare";
import { flushPendingLegalConsent, markPendingLegalConsent } from "@/lib/legal-consent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";
import FAQ from "@/components/faq";
import { useSupabaseUser } from "@/components/auth/use-supabase-user";
import { pricingCheckoutPath } from "@/lib/auth/next-path";
import { formatUsd } from "@/lib/utils";
import { webApi } from "@/lib/api/client";

export default function PricingPage() {
  return (
    <Suspense>
      <PricingInner />
    </Suspense>
  );
}

function PricingInner() {
  const { t } = useTranslation();
  const { isSignedIn, isLoaded } = useSupabaseUser();
  const router = useRouter();
  const params = useSearchParams();
  const autoCheckout =
    params.get("checkout") === "1" &&
    params.get("email_confirmed") !== "1" &&
    params.get("account_created") !== "1";
  const started = useRef(false);
  const [platform, setPlatform] = useState(params.get("platform") !== "0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ageTerms, setAgeTerms] = useState(false);

  const total = platform ? PRODUCTS.platform.amountCents : 0;

  async function startCheckout() {
    setError(null);
    if (!isLoaded) return;
    if (!isSignedIn) {
      const afterAccount = SKIP_PAYMENTS_FOR_PROMO
        ? "/dashboard"
        : pricingCheckoutPath({ platform });
      router.push(`/checkout-account?next=${encodeURIComponent(afterAccount)}`);
      return;
    }
    if (SKIP_PAYMENTS_FOR_PROMO) {
      router.push("/dashboard");
      return;
    }
    const products = platform ? (["platform"] as const) : [];
    if (products.length === 0) {
      setError(t("pricing.selectAtLeastOne"));
      return;
    }
    if (!ageTerms) {
      setError(t("auth.ageTermsRequired"));
      return;
    }
    setLoading(true);
    markPendingLegalConsent("pricing");
    try {
      try {
        await flushPendingLegalConsent();
      } catch {
        /* Consent row retries after checkout if the table is not live yet. */
      }
      const data = await webApi.post<{ url: string }>("/api/v1/checkout", { products });
      if (data.url) window.location.href = data.url;
    } catch (e) {
      started.current = false;
      setError(e instanceof Error ? e.message : t("pricing.checkoutFailed"));
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!autoCheckout || !isLoaded || !isSignedIn || started.current) return;
    started.current = true;
    void startCheckout();
    // Intentional: run once when signed-in checkout resume is requested.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoCheckout, isLoaded, isSignedIn]);

  const ctaLabel = SKIP_PAYMENTS_FOR_PROMO
    ? !isSignedIn
      ? t("pricing.ui.continueWithAccount")
      : t("navigation.dashboard")
    : !isLoaded
      ? t("pricing.ui.proceedToPayment")
      : !isSignedIn
        ? t("pricing.ui.continueWithAccount")
        : loading
          ? t("pricing.redirecting")
          : t("pricing.ui.proceedToPayment");

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <section className="relative overflow-hidden pt-28 pb-16">
        <PageHeroBackdrop />
        <div className="relative z-10 mx-auto max-w-4xl px-4">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            {t("pricing.headlinePart1")} {t("pricing.headlinePart2")}. {t("pricing.headlinePart3")}
          </h1>
          <p className="mt-3 inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-800">
            {t("floridaOnly.chip")}
          </p>
          <p className="mt-4 max-w-3xl text-slate-600 dark:text-slate-300">
            {t("pricing.subtitle")}
          </p>
          <p className="mt-2 max-w-3xl text-sm text-slate-500">{t("floridaOnly.note")}</p>
          <p className="mt-1 text-sm font-medium text-slate-500">{t("cta.path")}</p>
          <div className="mt-6">
            <ProductionTestingNotice compact />
          </div>

          <Card className="mt-10">
            <CardHeader>
              <CardTitle>{t("pricing.selectServices")}</CardTitle>
              <p className="text-sm text-slate-500">
                {t("pricing.checkoutNote")}
              </p>
              <p className="text-sm text-slate-500">{t("pricing.futureAddonsNote")}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex cursor-pointer flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div>
                  <p className="font-semibold">{t("pricing.services.noFaultAssistance.name")}</p>
                  <p className="text-sm text-slate-500">{t("pricing.services.noFaultAssistance.description")}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-bold">{PRODUCTS.platform.displayPrice}</p>
                  {PLATFORM_PRICE_TESTING ? (
                    <>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-teal-700">
                        {t("pricing.testing.rateLabel")}
                      </p>
                      <p className="text-xs text-slate-400 line-through">{PRODUCTS.platform.listDisplayPrice}</p>
                    </>
                  ) : null}
                  <input type="checkbox" className="mt-2" checked={platform} onChange={(e) => setPlatform(e.target.checked)} />
                </div>
              </label>
              <div className="flex items-center justify-between border-t pt-4">
                <span className="font-medium">{t("pricing.ui.totalLabel")}</span>
                <span className="text-xl font-bold">{formatUsd(total)}</span>
              </div>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <AgeTermsConsent checked={ageTerms} onChange={setAgeTerms} />
              <Button disabled={loading || total === 0 || !ageTerms} onClick={() => void startCheckout()} className="w-full bg-gradient-to-r from-emerald-600 to-teal-800">
                {ctaLabel}
              </Button>
              {SKIP_PAYMENTS_FOR_PROMO ? null : (
                <p className="text-center text-xs text-slate-500">{t("pricing.ui.securePaymentStripe")}</p>
              )}
              <p className="text-center text-xs text-slate-500">{t("pricing.ui.supportEmailLine")}</p>
            </CardContent>
          </Card>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t("pricing.ui.comparisonTitleLead")}
            </h2>
            <div className="mt-6">
              <PricingCompare />
            </div>
            <p className="mt-4 text-xs text-slate-500">{t("pricing.comparisonNote")}</p>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            {t("pricing.ui.complexClaimLead")}{" "}
            <Link className="underline" href="/when-to-call-an-attorney">{t("pricing.ui.complexClaimLink")}</Link>.
          </p>
        </div>
      </section>
      <FAQ
        title={t("pricing.ui.faqTitle")}
        subtitle={t("pricing.ui.faqSubtitle")}
        items={[
          { question: t("pricing.ui.faq1q"), answer: t("pricing.ui.faq1a") },
          { question: t("pricing.ui.faq2q"), answer: t("pricing.ui.faq2a") },
          { question: t("pricing.ui.faq3q"), answer: t("pricing.ui.faq3a") },
          { question: t("pricing.ui.faq4q"), answer: t("pricing.ui.faq4a") },
          { question: t("pricing.ui.faq5q"), answer: t("pricing.ui.faq5a") },
        ]}
      />
    </div>
  );
}
