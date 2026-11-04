"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { webApi } from "@/lib/api/client";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const BOOKING_URL = process.env.NEXT_PUBLIC_CLINIC_DEMO_BOOKING_URL;

export default function ClinicDemoPage() {
  const [clinicName, setClinicName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.gtag?.("event", "clinic_demo", { event_category: "clinic" });
    void webApi.post("/api/v1/clinic-demo", { source: "14days-click" }).catch(() => undefined);
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await webApi.post("/api/v1/clinic-demo", {
        source: "clinic-demo-form",
        clinicName,
        contactName,
        email,
        phone,
        preferredTime,
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the request.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <BrandLogo className="mb-8" />
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">Clinics</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">Book a 15-minute demo</h1>
      <p className="mt-4 text-base leading-relaxed text-slate-600">
        ClaimSaver+ is self-help software patients use themselves. Clinic staff see checklist
        progress only — never worksheets, documents, or medical details. Patients still pay $500
        for platform access.
      </p>
      {BOOKING_URL ? (
        <Button asChild className="mt-6 h-14 w-full bg-gradient-to-r from-emerald-600 to-teal-800 text-base">
          <a href={BOOKING_URL} rel="noopener noreferrer">
            Open the booking calendar
          </a>
        </Button>
      ) : null}
      {done ? (
        <p className="mt-8 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-950">
          Thanks. We’ll reply to schedule a 15-minute walkthrough.
        </p>
      ) : (
        <form onSubmit={(e) => void onSubmit(e)} className="mt-8 space-y-4">
          <p className="text-sm font-medium text-slate-800">
            {BOOKING_URL ? "Or leave your details and we’ll reach out:" : "Leave your details and we’ll reach out:"}
          </p>
          <Input
            required
            placeholder="Clinic name"
            value={clinicName}
            onChange={(e) => setClinicName(e.target.value)}
            className="h-12"
          />
          <Input
            required
            placeholder="Your name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="h-12"
          />
          <Input
            required
            type="email"
            placeholder="Work email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12"
          />
          <Input
            type="tel"
            placeholder="Mobile phone (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-12"
          />
          <Input
            placeholder="Preferred days or times"
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
            className="h-12"
          />
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <Button
            type="submit"
            disabled={busy}
            className="h-12 w-full bg-gradient-to-r from-emerald-600 to-teal-800"
          >
            {busy ? "Sending…" : "Request the demo"}
          </Button>
        </form>
      )}
      <p className="mt-6 text-sm text-slate-500">
        <Link href="/14days" className="underline underline-offset-2">
          Back to the 14-day checklist
        </Link>
      </p>
    </div>
  );
}
