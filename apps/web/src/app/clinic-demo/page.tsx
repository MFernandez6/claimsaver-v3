"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { webApi } from "@/lib/api/client";
import {
  clinicDemoBookingUrl,
  clinicDemoCalendarInviteUrl,
  googleAppointmentEmbedSrc,
} from "@/lib/clinic-demo";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function ClinicDemoPage() {
  const bookingUrl = clinicDemoBookingUrl();
  const inviteUrl = clinicDemoCalendarInviteUrl();
  const calendarUrl = bookingUrl || inviteUrl;
  const embedSrc = bookingUrl ? googleAppointmentEmbedSrc(bookingUrl) : null;

  useEffect(() => {
    window.gtag?.("event", "clinic_demo", { event_category: "clinic" });
    void webApi.post("/api/v1/clinic-demo", { source: "google-calendar" }).catch(() => undefined);
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <BrandLogo className="mb-8" />
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">Clinics</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">Book a 15-minute demo</h1>
      <p className="mt-4 text-base leading-relaxed text-slate-600">
        Pick a time on Google Calendar. ClaimSaver+ is self-help software patients use themselves.
        Clinic staff see checklist progress only — never worksheets, documents, or medical details.
        Patients still pay $500 for platform access.
      </p>
      <Button asChild className="mt-6 h-14 w-full bg-gradient-to-r from-emerald-600 to-teal-800 text-base sm:w-auto">
        <a href={calendarUrl} rel="noopener noreferrer">
          {bookingUrl ? "Pick a time on Google Calendar" : "Create the appointment in Google Calendar"}
        </a>
      </Button>
      {embedSrc ? (
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <iframe
            title="Google Calendar appointment schedule"
            src={embedSrc}
            className="h-[40rem] w-full border-0"
            loading="lazy"
          />
        </div>
      ) : (
        <p className="mt-4 text-sm leading-relaxed text-slate-500">
          Opens Google Calendar in this tab. Choose a 15-minute slot and send the invite to ClaimSaver+.
          You’ll get the calendar hold and a Meet link from Google.
        </p>
      )}
      <p className="mt-6 text-sm text-slate-500">
        <Link href="/14days" className="underline underline-offset-2">
          Back to the 14-day checklist
        </Link>
      </p>
    </div>
  );
}
