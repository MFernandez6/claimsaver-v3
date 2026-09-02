"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { flushPendingLegalConsent } from "@/lib/legal-consent";

function SuccessInner() {
  const { t } = useTranslation();
  const params = useSearchParams();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
    void flushPendingLegalConsent().catch(() => undefined);
  }, []);
  const sessionId = params.get("session_id");

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-slate-900">{t("success.receivedTitle")}</h1>
      <p className="mt-4 text-slate-600">
        {t("success.receivedBody")}
      </p>
      {ready && sessionId ? (
        <p className="mt-2 text-xs text-slate-400">{t("success.sessionLabel", { id: sessionId })}</p>
      ) : null}
      <div className="mt-8 flex justify-center gap-3">
        <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-800">
          <Link href="/claim-form">{t("success.openWorksheet")}</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard">{t("success.goToDashboard")}</Link>
        </Button>
      </div>
      <p className="mt-6 text-sm text-slate-500">
        {t("success.purchaseNote")}
      </p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessInner />
    </Suspense>
  );
}
