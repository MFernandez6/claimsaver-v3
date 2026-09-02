"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AgeTermsConsent } from "@/components/auth/age-terms-consent";
import { CheckEmailPanel } from "@/components/auth/check-email-panel";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { isSupabaseBrowserConfigured } from "@/lib/supabase/env-public";
import { safeNextPath, withQueryParam } from "@/lib/auth/next-path";
import { siteUrl } from "@/lib/utils";
import { MIN_PASSWORD_LENGTH } from "@claimsaver/shared";
import { normalizeEmail } from "@/lib/auth/email";
import { flushPendingLegalConsent, markPendingLegalConsent } from "@/lib/legal-consent";

export default function SignupPage() {
  return (
    <Suspense>
      <SignupInner />
    </Suspense>
  );
}

function SignupInner() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNextPath(params.get("next"), "/dashboard");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const [ageTerms, setAgeTerms] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!ageTerms) {
      setError(t("auth.ageTermsRequired"));
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(t("auth.passwordHint"));
      return;
    }
    if (!isSupabaseBrowserConfigured()) {
      setError(t("auth.authNotConfigured"));
      return;
    }
    setLoading(true);
    markPendingLegalConsent("signup");
    const { data, error: err } = await getBrowserSupabase().auth.signUp({
      email: normalizeEmail(email),
      password,
      options: {
        data: { first_name: firstName, last_name: lastName, full_name: `${firstName} ${lastName}`.trim() },
        emailRedirectTo: `${siteUrl()}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (data.session) {
      try {
        await flushPendingLegalConsent();
      } catch {
        /* Re-accept modal retries if the record did not land. */
      }
      router.push(withQueryParam(next, "account_created", "1"));
      router.refresh();
      return;
    }
    setCheckEmail(true);
  }

  if (checkEmail) {
    return <CheckEmailPanel email={email} />;
  }

  return (
    <div className="mx-auto max-w-md px-4 py-24">
      <h1 className="text-3xl font-bold text-slate-900">{t("auth.signUpTitle")}</h1>
      <p className="mt-2 inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-800">
        {t("floridaOnly.chip")}
      </p>
      <p className="mt-2 text-sm text-slate-500">{t("auth.signUpSubtitle")}</p>
      <p className="mt-2 text-sm text-slate-500">{t("floridaOnly.note")}</p>
      <p className="mt-1 text-xs text-slate-400">{t("cta.path")}</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input required placeholder={t("common.firstName")} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <Input required placeholder={t("common.lastName")} value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <Input type="email" required placeholder={t("common.email")} value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" required minLength={MIN_PASSWORD_LENGTH} placeholder={t("auth.passwordHint")} value={password} onChange={(e) => setPassword(e.target.value)} />
        <AgeTermsConsent checked={ageTerms} onChange={setAgeTerms} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" disabled={loading || !ageTerms} className="w-full bg-gradient-to-r from-emerald-600 to-teal-800">
          {loading ? t("auth.creating") : t("auth.createAccount")}
        </Button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        {t("auth.alreadyHaveAccount")} <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-teal-800 underline">{t("auth.signInTitle")}</Link>
      </p>
    </div>
  );
}
