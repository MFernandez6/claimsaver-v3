import { createHash } from "node:crypto";
import "server-only";
import { cookies, headers } from "next/headers";
import { daysCopy, ATTR_COOKIE, parseDaysLocale, type DaysLocale } from "@/content/14days";
import { thanksPathFor, type LeadAttribution } from "./attribution";
import { sendChecklistEmail } from "./email";
import { parseLeadForm, type Lead14DaysInput } from "./parse";
import { rateLimit } from "@/lib/security/rate-limit";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import type { SubmitLeadState } from "./types";

export type { SubmitLeadState };

function hashIp(ip: string) {
  const salt =
    process.env.LEAD_IP_SALT ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 24) ||
    "dev-only-lead-ip-salt";
  return createHash("sha256").update(`${ip}|${salt}`).digest("hex");
}

function clip(value: string | null | undefined, max = 500) {
  const next = String(value ?? "").trim();
  if (!next) return null;
  return next.slice(0, max);
}

async function persistLead(
  data: Lead14DaysInput,
  meta: { ipHash: string; userAgent: string | null },
) {
  const admin = getSupabaseAdmin();
  const attr: LeadAttribution = data.attribution;
  const row = {
    first_name: data.firstName,
    email: data.email,
    phone: data.phone,
    locale: data.locale,
    ack_self_help: true,
    sms_consent: data.smsConsent,
    sms_consent_text: data.smsConsentText,
    sms_consent_at: data.smsConsent ? new Date().toISOString() : null,
    utm_source: clip(attr.utmSource),
    utm_medium: clip(attr.utmMedium),
    utm_campaign: clip(attr.utmCampaign),
    utm_content: clip(attr.utmContent),
    utm_term: clip(attr.utmTerm),
    gclid: clip(attr.gclid),
    fbclid: clip(attr.fbclid),
    referrer: clip(attr.referrer, 1000),
    landing_path: clip(attr.landingPath, 200),
    ip_hash: meta.ipHash,
    user_agent: clip(meta.userAgent, 512),
    updated_at: new Date().toISOString(),
  };

  const { error } = await admin.from("leads_14days").upsert(row, { onConflict: "email" });
  if (error) throw error;
}

export async function submitLead14Days(
  _prev: SubmitLeadState,
  formData: FormData,
): Promise<SubmitLeadState> {
  const headerList = await headers();
  const cookieStore = await cookies();
  const localeGuess: DaysLocale = parseDaysLocale(formData.get("locale"));
  const copy = daysCopy[localeGuess];

  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "unknown";
  const limited = await rateLimit(`lead14:${ip}`, 5, 60 * 60 * 1000);
  if (!limited.ok) {
    return { error: copy.errorRateLimit };
  }

  const parsed = parseLeadForm(formData, cookieStore.get(ATTR_COOKIE)?.value);
  if (!parsed.ok) {
    return { error: parsed.error, fields: parsed.fields };
  }

  const locale = parsed.honeypot ? localeGuess : parsed.data.locale;
  const thanksCopy = daysCopy[locale];
  const success = {
    error: null,
    ok: true as const,
    pdfPath: thanksCopy.pdfPath,
    thanksPath: thanksPathFor(locale),
  };

  if (parsed.honeypot) {
    return success;
  }

  if (!isSupabaseConfigured()) {
    console.error("[14days] Supabase admin is not configured");
    return { error: copy.errorGeneric };
  }

  try {
    await persistLead(parsed.data, {
      ipHash: hashIp(ip),
      userAgent: headerList.get("user-agent"),
    });
  } catch (err) {
    console.error("[14days] persist failed", err);
    return { error: copy.errorGeneric };
  }

  try {
    await sendChecklistEmail(parsed.data.email, parsed.data.locale);
  } catch (err) {
    console.error("[14days] email threw", err);
    return { error: copy.errorGeneric };
  }

  return success;
}
