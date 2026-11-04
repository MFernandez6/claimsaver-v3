import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { jsonErr, jsonOk } from "@/lib/supabase/auth";
import { requireStaff } from "@/lib/admin/require-permission";
import { writeAudit } from "@/lib/admin/audit";
import { requestIp, requestUserAgent } from "@/lib/admin/request-meta";
import { sendAdminMfaCode } from "@/lib/admin/sms";
import {
  ADMIN_SMS_TTL_MS,
  generateSmsCode,
  hashSmsCode,
  maskMfaPhone,
  phoneLast4,
  resolveAdminMfaPhone,
  smsMessage,
} from "@/lib/admin/sms-otp";
import { rateLimit, rateLimitResponse, clientIp } from "@/lib/security/rate-limit";

export async function POST(req: NextRequest) {
  const limited = await rateLimit(`admin-sms:${clientIp(req)}`, 8, 15 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);

  const { user, role, response } = await requireStaff(req);
  if (response) return response;

  const phone = resolveAdminMfaPhone();
  const code = generateSmsCode();
  const expiresAt = new Date(Date.now() + ADMIN_SMS_TTL_MS).toISOString();
  const admin = getSupabaseAdmin();

  await admin
    .from("admin_sms_challenges")
    .update({ consumed_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .is("consumed_at", null);

  const { error } = await admin.from("admin_sms_challenges").insert({
    user_id: user.id,
    code_hash: hashSmsCode(user.id, code),
    phone_last4: phoneLast4(phone),
    expires_at: expiresAt,
  });
  if (error) return jsonErr(error.message, 500);

  const delivered = await sendAdminMfaCode({
    e164: phone,
    email: user.email || process.env.OWNER_SEED_EMAIL || "support@claimsaverplus.com",
    body: smsMessage(code),
  });
  if (!delivered.sms && !delivered.email) {
    return jsonErr(delivered.error || "Could not send the code", 502);
  }

  await writeAudit({
    actorId: user.id,
    actorRole: role,
    action: "admin.mfa.sms.challenge",
    resourceType: "admin",
    resourceId: "session",
    metadata: { phoneLast4: phoneLast4(phone), sms: delivered.sms, email: delivered.email },
    ip: requestIp(req),
    userAgent: requestUserAgent(req),
  });

  return jsonOk({
    phone: maskMfaPhone(phone),
    sms: delivered.sms,
    email: delivered.email,
    expiresInSec: Math.floor(ADMIN_SMS_TTL_MS / 1000),
  });
}

export async function GET() {
  return NextResponse.json({ error: "Use POST" }, { status: 405 });
}
