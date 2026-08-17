"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { isSupabaseBrowserConfigured } from "@/lib/supabase/env-public";

export default function LoginInner() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isSupabaseBrowserConfigured()) {
      setError(t("auth.authNotConfigured"));
      return;
    }
    setLoading(true);
    const { error: err } = await getBrowserSupabase().auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-24">
      <h1 className="text-3xl font-bold text-slate-900">{t("auth.signInTitle")}</h1>
      <p className="mt-2 text-sm text-slate-500">{t("auth.signInSubtitle")}</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <Input type="email" required placeholder={t("common.email")} value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" required placeholder={t("common.password")} value={password} onChange={(e) => setPassword(e.target.value)} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-emerald-600 to-teal-800">
          {loading ? t("auth.signingIn") : t("auth.signInTitle")}
        </Button>
      </form>
      <p className="mt-4 text-sm">
        <Link href="/forgot-password" className="text-teal-800 underline">{t("auth.forgotPassword")}</Link>
      </p>
      <p className="mt-2 text-sm text-slate-600">
        {t("auth.newHere")}{" "}
        <Link href={`/signup?next=${encodeURIComponent(next)}`} className="text-teal-800 underline">
          {t("auth.createAccount")}
        </Link>
      </p>
    </div>
  );
}
