"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AgeTermsConsent } from "@/components/auth/age-terms-consent";
import { CheckEmailPanel } from "@/components/auth/check-email-panel";
import { useSupabaseUser } from "@/components/auth/use-supabase-user";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { isSupabaseBrowserConfigured } from "@/lib/supabase/env-public";
import { safeNextPath, withQueryParam } from "@/lib/auth/next-path";
import { siteUrl } from "@/lib/utils";
import { MIN_PASSWORD_LENGTH } from "@claimsaver/shared";

export default function CheckoutAccountPage() {
  return (
    <Suspense>
      <CheckoutAccountInner />
    </Suspense>
  );
}

function CheckoutAccountInner() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useSearchParams();
  const { isLoaded, isSignedIn } = useSupabaseUser();
  const next = safeNextPath(params.get("next"), "/pricing?checkout=1");
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const [ageTerms, setAgeTerms] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || checkEmail) return;
    router.replace(next);
  }, [isLoaded, isSignedIn, checkEmail, next, router]);

  async function onSignup(e: React.FormEvent) {
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
    const { data, error: err } = await getBrowserSupabase().auth.signUp({
      email,
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
      router.push(withQueryParam(next, "account_created", "1"));
      router.refresh();
      return;
    }
    setCheckEmail(true);
  }

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isSupabaseBrowserConfigured()) {
      setError(t("auth.authNotConfigured"));
      return;
    }
    setLoading(true);
    const { error: err } = await getBrowserSupabase().auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  if (checkEmail) {
    return <CheckEmailPanel email={email} />;
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{t("auth.checkoutGateTitle")}</h1>
      <p className="mt-3 text-slate-600">{t("auth.checkoutGateSubtitle")}</p>
      <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => { setMode("signup"); setError(null); }}
          className={`rounded-lg px-3 py-2 text-sm font-semibold ${mode === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"}`}
        >
          {t("auth.checkoutCreateTab")}
        </button>
        <button
          type="button"
          onClick={() => { setMode("login"); setError(null); }}
          className={`rounded-lg px-3 py-2 text-sm font-semibold ${mode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"}`}
        >
          {t("auth.checkoutSignInTab")}
        </button>
      </div>
      {mode === "signup" ? (
        <form onSubmit={onSignup} className="mt-6 space-y-4">
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
      ) : (
        <form onSubmit={onLogin} className="mt-6 space-y-4">
          <Input type="email" required placeholder={t("common.email")} value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" required placeholder={t("common.password")} value={password} onChange={(e) => setPassword(e.target.value)} />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-emerald-600 to-teal-800">
            {loading ? t("auth.signingIn") : t("auth.signInTitle")}
          </Button>
          <p className="text-sm">
            <Link href="/forgot-password" className="text-teal-800 underline">{t("auth.forgotPassword")}</Link>
          </p>
        </form>
      )}
    </div>
  );
}
