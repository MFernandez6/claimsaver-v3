"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { FlashNotice } from "@/components/flash-notice";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { isSupabaseBrowserConfigured } from "@/lib/supabase/env-public";
import { safeNextPath, withQueryParam } from "@/lib/auth/next-path";
import { siteUrl } from "@/lib/utils";

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
  const next = safeNextPath(params.get("next"), "/claim-form");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
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

  if (checkEmail) {
    return (
      <div className="mx-auto max-w-md px-4 py-24">
        <FlashNotice message={t("auth.checkEmailNotice")} />
        <div className="rounded-2xl border border-teal-200 bg-teal-50 p-6 text-teal-950 shadow-sm" role="status">
          <Mail className="h-8 w-8 text-teal-700" aria-hidden />
          <h1 className="mt-3 text-2xl font-bold">{t("auth.checkEmailTitle")}</h1>
          <p className="mt-3 text-sm leading-relaxed">{t("auth.checkEmailBody", { email })}</p>
          <p className="mt-3 text-sm text-teal-800">{t("auth.checkEmailSpam")}</p>
        </div>
      </div>
    );
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
        <Input type="password" required minLength={8} placeholder={t("auth.passwordHint")} value={password} onChange={(e) => setPassword(e.target.value)} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-emerald-600 to-teal-800">
          {loading ? t("auth.creating") : t("auth.createAccount")}
        </Button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        {t("auth.alreadyHaveAccount")} <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-teal-800 underline">{t("auth.signInTitle")}</Link>
      </p>
    </div>
  );
}
