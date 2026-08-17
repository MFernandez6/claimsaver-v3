"use client";

import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

/** Base64("support@claimsaverplus.com") — decoded only on the client to reduce plain-email scraping. */
const SUPPORT_EMAIL_B64 = "c3VwcG9ydEBjbGFpbXNhdmVycGx1cy5jb20=";

function decodeSupportEmail(): string {
  try {
    return typeof atob !== "undefined" ? atob(SUPPORT_EMAIL_B64) : "";
  } catch {
    return "";
  }
}

type ObfuscatedSupportEmailProps = {
  className?: string;
  /** Plain “Email support” (etc.) before the address is revealed on the client */
  placeholder?: string;
};

/**
 * Renders a mailto link without putting the full address in static HTML on first paint.
 * After hydration, the visible label matches the decoded address (same as typical mailto text).
 */
export function ObfuscatedSupportEmail({
  className,
  placeholder,
}: ObfuscatedSupportEmailProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const label = placeholder ?? t("faqBox.emailSupport");

  useEffect(() => {
    setEmail(decodeSupportEmail());
  }, []);

  if (!email) {
    return (
      <span className={className} suppressHydrationWarning>
        {label}
      </span>
    );
  }

  return (
    <a className={className} href={`mailto:${email}`} suppressHydrationWarning>
      {email}
    </a>
  );
}

type ObfuscatedMailtoButtonProps = {
  className?: string;
  children?: React.ReactNode;
};

/** Button-styled control that opens the mail client without a discoverable mailto in source order (address built in handler). */
export function ObfuscatedMailtoButton({
  className,
  children,
}: ObfuscatedMailtoButtonProps) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        const e = decodeSupportEmail();
        if (e) window.location.href = `mailto:${e}`;
      }}
    >
      {children ?? t("faqBox.emailSupport")}
    </button>
  );
}
