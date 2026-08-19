"use client";

import Link from "next/link";
import { Trans, useTranslation } from "react-i18next";

export function AgeTermsConsent({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  const { t } = useTranslation();

  return (
    <label className="flex items-start gap-2 text-xs leading-relaxed text-slate-600">
      <input
        type="checkbox"
        required
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0"
      />
      <span>
        <Trans
          i18nKey="auth.ageTermsConsent"
          t={t}
          components={{
            terms: <Link href="/terms-of-service" className="font-medium text-teal-800 underline" />,
            privacy: <Link href="/privacy-policy" className="font-medium text-teal-800 underline" />,
          }}
        />
      </span>
    </label>
  );
}
