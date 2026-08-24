"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { MIN_PASSWORD_LENGTH } from "@claimsaver/shared";

export default function UpdatePasswordPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(t("auth.passwordHint"));
      return;
    }
    const { error: err } = await getBrowserSupabase().auth.updateUser({ password });
    if (err) {
      setError(err.message);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-24">
      <h1 className="text-3xl font-bold">{t("auth.newPasswordTitle")}</h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <Input type="password" required minLength={MIN_PASSWORD_LENGTH} placeholder={t("auth.passwordHint")} value={password} onChange={(e) => setPassword(e.target.value)} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" className="w-full">{t("auth.updatePassword")}</Button>
      </form>
    </div>
  );
}
