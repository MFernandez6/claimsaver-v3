"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { webApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";
import { useSupabaseUser } from "@/components/auth/use-supabase-user";

export function EnrollInvalid() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <BrandLogo className="mb-8" />
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">
        {t("pages.enroll.kicker")}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">{t("pages.enroll.invalidTitle")}</h1>
      <p className="mt-4 text-base leading-relaxed text-slate-600">{t("pages.enroll.invalidBody")}</p>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">{t("copy.disclaimer.selfHelp")}</p>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{t("copy.clinic.visibility")}</p>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{t("copy.patientPrice.sameForReferrals")}</p>
      <p className="mt-6">
        <Link href="/" className="text-sm font-medium text-teal-800 underline underline-offset-2">
          {t("pages.enroll.backHome")}
        </Link>
      </p>
    </div>
  );
}

export function EnrollClient({
  code,
  clinicName,
  open,
}: {
  code: string;
  clinicName: string;
  open: boolean;
}) {
  const { t } = useTranslation();
  const { isLoaded, isSignedIn } = useSupabaseUser();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = `${clinicName} invited you | ClaimSaver+`;
  }, [clinicName]);

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

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <BrandLogo className="mb-8" />
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">
        {t("pages.enroll.kicker")}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">
        {t("pages.enroll.title", { clinicName })}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-slate-600">{t("copy.disclaimer.selfHelp")}</p>
      <p className="mt-3 text-base leading-relaxed text-slate-600">{t("copy.clinic.visibility")}</p>
      <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950">
        {t("pages.enroll.fourteenNote")}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{t("copy.patientPrice.sameForReferrals")}</p>
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      {done ? (
        <p className="mt-6 text-teal-800">{t("pages.enroll.enrolled")}</p>
      ) : !isLoaded ? (
        <p className="mt-6 text-sm text-slate-500">{t("pages.enroll.checking")}</p>
      ) : isSignedIn ? (
        <div className="mt-6 space-y-3">
          <Button
            className="h-12 w-full bg-gradient-to-r from-emerald-600 to-teal-800"
            disabled={!open || busy}
            onClick={() => void join()}
          >
            {open ? (busy ? "Enrolling…" : t("pages.enroll.enrollCta")) : t("pages.enroll.enrollClosed")}
          </Button>
          <Button asChild variant="outline" className="h-12 w-full">
            <Link href="/dashboard">{t("pages.enroll.dashboard")}</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          <Button asChild className="h-14 w-full bg-gradient-to-r from-emerald-600 to-teal-800 text-base">
            <Link href={signupHref}>{t("pages.enroll.createAccount")}</Link>
          </Button>
          <p className="text-center text-sm text-slate-600">
            {t("pages.enroll.haveAccount")}{" "}
            <Link href={loginHref} className="font-medium text-teal-800 underline underline-offset-2">
              {t("navigation.signIn")}
            </Link>
          </p>
          {!open ? (
            <p className="text-sm text-amber-800">{t("pages.enroll.notAccepting")}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
