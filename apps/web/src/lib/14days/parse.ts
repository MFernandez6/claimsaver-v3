import { z } from "zod";
import {
  SMS_CONSENT_TEXT,
  daysCopy,
  parseDaysLocale,
  type DaysLocale,
} from "@/content/14days";
import { parseUsPhone } from "./phone";
import {
  emptyAttribution,
  parseAttributionCookie,
  type LeadAttribution,
} from "./attribution";

export type Lead14DaysInput = {
  firstName: string;
  email: string;
  phone: string | null;
  locale: DaysLocale;
  ackSelfHelp: true;
  smsConsent: boolean;
  smsConsentText: string | null;
  attribution: LeadAttribution;
};

export type ParseLeadResult =
  | { ok: true; honeypot: true }
  | { ok: true; honeypot: false; data: Lead14DaysInput }
  | { ok: false; error: string; fields?: Record<string, string> };

const rawSchema = z.object({
  firstName: z.string().max(80).optional(),
  email: z.string().max(254).optional(),
  phone: z.string().max(40).optional(),
  locale: z.enum(["en", "es", "fr"]).optional(),
  ackSelfHelp: z.string().optional(),
  smsConsent: z.string().optional(),
  website: z.string().max(200).optional(),
  attr: z.string().max(4000).optional(),
  landingPath: z.string().max(200).optional(),
});

function asFormRecord(form: FormData | Record<string, unknown>) {
  if (form instanceof FormData) {
    const rec: Record<string, unknown> = {};
    form.forEach((value, key) => {
      if (typeof value === "string") rec[key] = value;
    });
    return rec;
  }
  return form;
}

export function parseLeadForm(
  form: FormData | Record<string, unknown>,
  cookieRaw?: string | null,
): ParseLeadResult {
  const rec = asFormRecord(form);
  const parsed = rawSchema.safeParse(rec);
  const locale: DaysLocale = parseDaysLocale(parsed.success ? parsed.data.locale : undefined);
  const copy = daysCopy[locale];

  if (!parsed.success) {
    return { ok: false, error: copy.errorGeneric };
  }

  if (parsed.data.website && parsed.data.website.trim()) {
    return { ok: true, honeypot: true };
  }

  const firstName = (parsed.data.firstName ?? "").trim();
  const email = (parsed.data.email ?? "").trim().toLowerCase();
  const phoneRaw = parsed.data.phone ?? "";
  const ack = parsed.data.ackSelfHelp === "on" || parsed.data.ackSelfHelp === "true";
  const sms = parsed.data.smsConsent === "on" || parsed.data.smsConsent === "true";
  const fields: Record<string, string> = {};

  if (!firstName) fields.firstName = copy.errorFirstName;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fields.email = copy.errorEmail;

  const phone = parseUsPhone(phoneRaw);
  if (!phone.ok) fields.phone = copy.errorPhone;
  if (!ack) fields.ackSelfHelp = copy.errorAck;
  if (phone.ok && phone.value && !sms) fields.smsConsent = copy.errorSms;

  if (Object.keys(fields).length) {
    return { ok: false, error: copy.errorGeneric, fields };
  }

  const fromCookie = parseAttributionCookie(cookieRaw);
  const fromField = parseAttributionCookie(parsed.data.attr ?? null);
  const attribution = {
    ...emptyAttribution(),
    ...fromField,
    ...Object.fromEntries(
      Object.entries(fromCookie).filter(([, v]) => Boolean(v)),
    ),
  } as LeadAttribution;
  if (!attribution.landingPath && parsed.data.landingPath) {
    attribution.landingPath = parsed.data.landingPath;
  }

  return {
    ok: true,
    honeypot: false,
    data: {
      firstName,
      email,
      phone: phone.ok ? phone.value : null,
      locale,
      ackSelfHelp: true,
      smsConsent: Boolean(phone.ok && phone.value && sms),
      smsConsentText: phone.ok && phone.value && sms ? SMS_CONSENT_TEXT[locale] : null,
      attribution,
    },
  };
}
