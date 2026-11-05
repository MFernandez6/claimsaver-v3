export type SmsReceipt = {
  phone: string | null;
  smsConsent: boolean;
  smsConsentText: string | null;
  smsConsentAt: string | null;
};

/** Phone plus the ticked box, the exact copy, and the time they ticked it. */
export function canSendLeadSms(row: SmsReceipt): boolean {
  return Boolean(row.phone && row.smsConsent && row.smsConsentAt && row.smsConsentText);
}

/**
 * Keep a prior SMS yes. A later email-only submit must not wipe the phone,
 * the tick, the stored copy, or the timestamp.
 */
export function mergeLeadSmsReceipt(
  incoming: { phone: string | null; smsConsent: boolean; smsConsentText: string | null },
  existing: SmsReceipt | null,
  now: string,
): SmsReceipt {
  const phone = incoming.phone || existing?.phone || null;
  if (incoming.smsConsent && incoming.smsConsentText) {
    return {
      phone,
      smsConsent: true,
      smsConsentText: incoming.smsConsentText,
      smsConsentAt: existing?.smsConsentAt || now,
    };
  }
  return {
    phone,
    smsConsent: Boolean(existing?.smsConsent),
    smsConsentText: existing?.smsConsentText ?? null,
    smsConsentAt: existing?.smsConsentAt ?? null,
  };
}
