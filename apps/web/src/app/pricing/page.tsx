"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { PRODUCTS } from "@claimsaver/shared";
import { PricingCompare } from "@/components/pricing-compare";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";
import FAQ from "@/components/faq";
import { useSupabaseUser } from "@/components/auth/use-supabase-user";
import { formatUsd } from "@/lib/utils";
import { webApi } from "@/lib/api/client";

export default function PricingPage() {
  const { t } = useTranslation();
  const { isSignedIn, isLoaded } = useSupabaseUser();
  const router = useRouter();
  const [platform, setPlatform] = useState(true);
  const [notarization, setNotarization] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total =
    (platform ? PRODUCTS.platform.amountCents : 0) +
    (notarization ? PRODUCTS.notarization.amountCents : 0);

  async function checkout() {
    setError(null);
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push("/signup?next=/pricing");
      return;
    }
    const products = [
      ...(platform ? (["platform"] as const) : []),
      ...(notarization ? (["notarization"] as const) : []),
    ];
    if (products.length === 0) {
      setError(t("pricing.selectAtLeastOne"));
      return;
    }
    setLoading(true);
    try {
      const data = await webApi.post<{ url: string }>("/api/v1/checkout", { products });
      if (data.url) window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : t("pricing.checkoutFailed"));
    } finally {
      setLoading(false);
    }
  }

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

          <Card className="mt-10">
            <CardHeader>
              <CardTitle>{t("pricing.selectServices")}</CardTitle>
              <p className="text-sm text-slate-500">
                {t("pricing.checkoutNote")}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border p-4">
                <div>
                  <p className="font-semibold">{t("pricing.services.noFaultAssistance.name")}</p>
                  <p className="text-sm text-slate-500">{t("pricing.services.noFaultAssistance.description")}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{PRODUCTS.platform.displayPrice}</p>
                  <input type="checkbox" className="mt-2" checked={platform} onChange={(e) => setPlatform(e.target.checked)} />
                </div>
              </label>
              <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border p-4">
                <div>
                  <p className="font-semibold">{t("pricing.services.notarization.name")}</p>
                  <p className="text-sm text-slate-500">{t("pricing.services.notarization.description")}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{PRODUCTS.notarization.displayPrice}</p>
                  <input type="checkbox" className="mt-2" checked={notarization} onChange={(e) => setNotarization(e.target.checked)} />
                </div>
              </label>
              <div className="flex items-center justify-between border-t pt-4">
                <span className="font-medium">{t("pricing.ui.totalLabel")}</span>
                <span className="text-xl font-bold">{formatUsd(total)}</span>
              </div>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <Button disabled={loading || total === 0} onClick={() => void checkout()} className="w-full bg-gradient-to-r from-emerald-600 to-teal-800">
                {loading ? t("pricing.redirecting") : t("pricing.ui.proceedToPayment")}
              </Button>
              <p className="text-center text-xs text-slate-500">{t("pricing.ui.securePaymentStripe")}</p>
            </CardContent>
          </Card>

          <div className="mt-12">
            <p className="mb-5 text-sm font-medium text-slate-500">
              {t("pricing.ui.comparisonTitleLead")} {t("pricing.ui.comparisonTitleAccent")}
            </p>
            <PricingCompare />
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
        items={[
          { question: t("pricing.ui.faq1q"), answer: t("pricing.ui.faq1a") },
          { question: t("pricing.ui.faq3q"), answer: t("pricing.ui.faq3a") },
          { question: t("pricing.ui.faq5q"), answer: t("pricing.ui.faq5a") },
        ]}
      />
    </div>
  );
}
