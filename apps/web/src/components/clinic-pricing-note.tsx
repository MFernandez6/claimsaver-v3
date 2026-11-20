"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clinicPricingKey } from "@/lib/copy/pricing";

export function ClinicPricingNote({
  ctaHref,
  ctaLabel,
}: {
  ctaHref?: string;
  ctaLabel?: string;
}) {
  const { t } = useTranslation();

  return (
    <Card className="border-teal-200 bg-gradient-to-br from-teal-50/90 to-white">
      <CardHeader className="items-center text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">
          {t("copy.clinic.pricingKicker")}
        </p>
        <CardTitle className="text-xl">{t("copy.clinic.pricingHeading")}</CardTitle>
      </CardHeader>
      <CardContent className="mx-auto max-w-xl space-y-3 text-center text-base leading-relaxed text-slate-600">
        <p>{t(clinicPricingKey())}</p>
        <ul className="list-disc space-y-1 pl-5 text-left text-sm text-slate-600">
          {([1, 2, 3, 4, 5, 6] as const).map((n) => (
            <li key={n}>{t(`copy.clinic.include${n}`)}</li>
          ))}
        </ul>
        <p>{t("copy.clinic.noReferralFees")}</p>
        {ctaHref && ctaLabel ? (
          <div className="pt-2">
            <Button asChild className="h-12 bg-gradient-to-r from-emerald-600 to-teal-800">
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
