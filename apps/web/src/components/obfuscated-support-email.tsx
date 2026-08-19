"use client";

import type { ReactNode } from "react";
import { SUPPORT_EMAIL } from "@claimsaver/shared";
import { useTranslation } from "react-i18next";

type SupportEmailLinkProps = {
  className?: string;
  /** If set, shown instead of the address (the mailto still uses SUPPORT_EMAIL). */
  children?: ReactNode;
};

/** Public Workspace inbox — shown as a mailto so visitors can copy or click it. */
export function ObfuscatedSupportEmail({ className, children }: SupportEmailLinkProps) {
  return (
    <a className={className} href={`mailto:${SUPPORT_EMAIL}`}>
      {children ?? SUPPORT_EMAIL}
    </a>
  );
}

type ObfuscatedMailtoButtonProps = {
  className?: string;
  children?: ReactNode;
};

/** Button that opens a mail client to the public support address. */
export function ObfuscatedMailtoButton({
  className,
  children,
}: ObfuscatedMailtoButtonProps) {
  const { t } = useTranslation();
  return (
    <a className={className} href={`mailto:${SUPPORT_EMAIL}`}>
      {children ?? t("faqBox.emailSupport")}
    </a>
  );
}
