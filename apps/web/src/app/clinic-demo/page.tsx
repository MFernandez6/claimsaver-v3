"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MarketingPage, MarketingSection } from "@/components/marketing-page";
import { webApi } from "@/lib/api/client";
import { clinicDemoBookingUrl, googleAppointmentEmbedSrc } from "@/lib/clinic-demo";
import { ClinicPricingNote } from "@/components/clinic-pricing-note";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function ClinicDemoPage() {
  const { t } = useTranslation();
  const bookingUrl = clinicDemoBookingUrl();
  const embedSrc = googleAppointmentEmbedSrc(bookingUrl);

  useEffect(() => {
    window.gtag?.("event", "clinic_demo", { event_category: "clinic" });
    void webApi.post("/api/v1/clinic-demo", { source: "google-calendar" }).catch(() => undefined);
  }, []);

  return (
    <MarketingPage
      kicker={t("pages.clinicDemo.kicker")}
      title={t("pages.clinicDemo.title")}
      subtitle={t("copy.clinic.valueProp")}
      intro={<p>{t("pages.clinicDemo.canvassNote")}</p>}
      note={t("copy.disclaimer.selfHelp")}
      actions={
        <>
          <Button asChild className="h-12 bg-gradient-to-r from-emerald-600 to-teal-800">
            <a href={bookingUrl} rel="noopener noreferrer">
              {t("pages.clinicDemo.book")}
            </a>
          </Button>
          <Button variant="outline" asChild className="h-12">
            <Link href="/for-clinics">{t("pages.clinicDemo.programLink")}</Link>
          </Button>
        </>
      }
    >
      <MarketingSection>
        <ClinicPricingNote />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="pt-6 text-sm leading-relaxed text-slate-600">
              {t("copy.clinic.visibility")}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-sm leading-relaxed text-slate-600">
              {t("copy.patientPrice.sameForReferrals")}
            </CardContent>
          </Card>
        </div>
      </MarketingSection>

      {embedSrc ? (
        <MarketingSection>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <iframe
              title="Google Calendar appointment schedule"
              src={embedSrc}
              className="h-[40rem] w-full border-0"
              loading="lazy"
            />
          </div>
        </MarketingSection>
      ) : null}

      <MarketingSection last>
        <Link href="/14days" className="text-sm font-semibold text-teal-800 underline underline-offset-2">
          {t("pages.clinicDemo.back")}
        </Link>
      </MarketingSection>
    </MarketingPage>
  );
}
