"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { siteUrl } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await getBrowserSupabase().auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl()}/update-password`,
    });
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-24">
      <h1 className="text-3xl font-bold">{t("auth.resetTitle")}</h1>
      {sent ? (
        <p className="mt-4 text-slate-600">{t("auth.resetSent")}</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Input type="email" required placeholder={t("common.email")} value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit" className="w-full">{t("auth.sendReset")}</Button>
        </form>
      )}
    </div>
  );
}
