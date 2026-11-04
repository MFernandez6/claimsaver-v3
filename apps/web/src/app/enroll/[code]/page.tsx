"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { webApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";
import { useSupabaseUser } from "@/components/auth/use-supabase-user";
import { PLATFORM_LIST_AMOUNT_CENTS } from "@claimsaver/shared";

function dollars() {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(PLATFORM_LIST_AMOUNT_CENTS / 100);
}

export default function EnrollPage() {
  const params = useParams<{ code: string }>();
  const code = params.code;
  const { isLoaded, isSignedIn } = useSupabaseUser();
  const [clinicName, setClinicName] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    webApi
      .get<{ clinicName: string; open: boolean }>(`/api/v1/enroll/${code}`)
      .then((data) => {
        setClinicName(data.clinicName);
        setOpen(data.open);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Invalid link"));
  }, [code]);

  const join = async () => {
    setBusy(true);
    setError(null);
    try {
      await webApi.post(`/api/v1/enroll/${code}`, {});
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not enroll");
    } finally {
      setBusy(false);
    }
  };

  const signupHref = `/signup?next=${encodeURIComponent(`/enroll/${code}`)}`;
  const loginHref = `/login?next=${encodeURIComponent(`/enroll/${code}`)}`;
  const checkoutNote = `Clinic referral does not change the platform price. After you create an account you still pay ${dollars()} for ClaimSaver+ access. You remain the filer. The clinic sees checklist progress only — not your worksheet or medical details.`;

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <BrandLogo className="mb-8" />
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">Clinic invitation</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">
        {clinicName ? `${clinicName} invited you` : "Clinic enrollment"}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-slate-600">
        ClaimSaver+ is self-help software for a Florida PIP claim. You stay the filer. This
        clinic can see whether you started and which worksheet step you are on — not the
        answers, documents, or medical details.
      </p>
      <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950">
        Florida PIP generally requires initial medical care within <strong>14 days</strong> of
        the crash. This is education, not a determination that any visit counts in your case.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{checkoutNote}</p>
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      {done ? (
        <p className="mt-6 text-teal-800">You’re enrolled. Continue on your dashboard. The clinic sees progress only.</p>
      ) : !isLoaded ? (
        <p className="mt-6 text-sm text-slate-500">Checking your session…</p>
      ) : isSignedIn ? (
        <div className="mt-6 space-y-3">
          <Button
            className="h-12 w-full bg-gradient-to-r from-emerald-600 to-teal-800"
            disabled={!open || busy}
            onClick={() => void join()}
          >
            {open ? (busy ? "Enrolling…" : "Enroll with this clinic") : "Enrollment is closed"}
          </Button>
          <Button asChild variant="outline" className="h-12 w-full">
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          <Button asChild className="h-14 w-full bg-gradient-to-r from-emerald-600 to-teal-800 text-base">
            <Link href={signupHref}>Create my account</Link>
          </Button>
          <p className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link href={loginHref} className="font-medium text-teal-800 underline underline-offset-2">
              Sign in
            </Link>
          </p>
          {!open && clinicName ? (
            <p className="text-sm text-amber-800">This clinic is not accepting enrollments yet.</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
