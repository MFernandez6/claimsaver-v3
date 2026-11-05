import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { jsonErr, jsonOk } from "@/lib/supabase/auth";
import { requirePermission } from "@/lib/admin/require-permission";
import { rateLimit, rateLimitResponse, clientIp } from "@/lib/security/rate-limit";
import { maskEmail, maskName, maskPhone } from "@/lib/auth/mask";
import { canSendLeadSms } from "@/lib/14days/sms-receipt";

const LEAD_COLUMNS =
  "id, created_at, first_name, email, phone, locale, sms_consent, sms_consent_at, sms_consent_text, utm_source, utm_medium, utm_campaign, gclid, fbclid";

export async function GET(req: NextRequest) {
  const limited = await rateLimit(`admin-leads:${clientIp(req)}`, 40, 10 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);

  const { role, response } = await requirePermission(req, "admin.overview", {
    resourceType: "lead",
    resourceId: "list",
  });
  if (response) return response;
  const reveal = role === "OWNER";

  const { data, error } = await getSupabaseAdmin()
    .from("leads_14days")
    .select(LEAD_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) return jsonErr(error.message, 500);

  return jsonOk({
    leads: (data ?? []).map((row) => ({
      id: row.id,
      createdAt: row.created_at,
      name: reveal ? row.first_name : maskName(String(row.first_name || "")),
      email: reveal ? row.email : maskEmail(String(row.email || "")),
      phone: row.phone ? (reveal ? row.phone : maskPhone(String(row.phone))) : null,
      smsConsent: Boolean(row.sms_consent),
      smsConsentAt: row.sms_consent_at ?? null,
      smsConsentText: row.sms_consent_text ?? null,
      canText: canSendLeadSms({
        phone: row.phone ?? null,
        smsConsent: Boolean(row.sms_consent),
        smsConsentAt: row.sms_consent_at ?? null,
        smsConsentText: row.sms_consent_text ?? null,
      }),
      locale: row.locale,
      utmSource: row.utm_source,
      utmMedium: row.utm_medium,
      utmCampaign: row.utm_campaign,
      gclid: row.gclid,
      fbclid: row.fbclid,
    })),
  });
}
