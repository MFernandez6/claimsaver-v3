"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AgeTermsConsent } from "@/components/auth/age-terms-consent";
import { Button } from "@/components/ui/button";
import { markPendingLegalConsent, flushPendingLegalConsent } from "@/lib/legal-consent";

export function LegalReaccept({ onAccepted }: { onAccepted: () => void }) {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!checked) {
      setError(t("auth.ageTermsRequired"));
      return;
    }
    setLoading(true);
    setError(null);
    markPendingLegalConsent("reaccept");
    try {
      await flushPendingLegalConsent();
      onAccepted();
    } catch {
      setError(t("legal.consentFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{t("legal.reacceptTitle")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {t("legal.reacceptBody")}
        </p>
        <div className="mt-4">
          <AgeTermsConsent checked={checked} onChange={setChecked} />
        </div>
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        <Button
          disabled={loading || !checked}
          onClick={() => void submit()}
          className="mt-4 w-full bg-gradient-to-r from-emerald-600 to-teal-800"
        >
          {loading ? t("common.loading") : t("legal.reacceptCta")}
        </Button>
      </div>
    </div>
  );
}
