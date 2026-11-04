import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { jsonErr } from "@/lib/supabase/auth";
import { requireStaff } from "@/lib/admin/require-permission";
import { writeAudit } from "@/lib/admin/audit";
import { requestIp, requestUserAgent } from "@/lib/admin/request-meta";
import { ADMIN_SMS_MAX_ATTEMPTS, hashSmsCode, hashesMatch } from "@/lib/admin/sms-otp";
import {
  ADMIN_ABSOLUTE_MS,
  ADMIN_IDLE_MS,
  applyAdminSessionCookies,
} from "@/lib/auth/admin-session";
import { maskEmail } from "@/lib/auth/mask";
import { rateLimit, rateLimitResponse, clientIp } from "@/lib/security/rate-limit";

export async function POST(req: NextRequest) {
  const limited = await rateLimit(`admin-sms-verify:${clientIp(req)}`, 20, 15 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);

  const { user, role, response } = await requireStaff(req);
  if (response) return response;

  const body = (await req.json().catch(() => null)) as { code?: unknown } | null;
  const code = typeof body?.code === "string" ? body.code.replace(/\D/g, "") : "";
  if (code.length !== 6) return jsonErr("Enter the 6-digit code", 400);

  const admin = getSupabaseAdmin();
  const { data: rows } = await admin
    .from("admin_sms_challenges")
    .select("id, code_hash, expires_at, consumed_at, attempts")
    .eq("user_id", user.id)
    .is("consumed_at", null)
    .order("created_at", { ascending: false })
    .limit(1);
  const challenge = rows?.[0];
  if (!challenge) return jsonErr("Request a new code", 400);

  const expires = Date.parse(String(challenge.expires_at));
  if (!expires || Date.now() > expires) {
    await admin
      .from("admin_sms_challenges")
      .update({ consumed_at: new Date().toISOString() })
      .eq("id", challenge.id);
    return jsonErr("That code expired. Request a new one.", 401);
  }

  const attempts = Number(challenge.attempts ?? 0);
  if (attempts >= ADMIN_SMS_MAX_ATTEMPTS) {
    await admin
      .from("admin_sms_challenges")
      .update({ consumed_at: new Date().toISOString() })
      .eq("id", challenge.id);
    return jsonErr("Too many attempts. Request a new code.", 401);
  }

  const expected = String(challenge.code_hash);
  const incoming = hashSmsCode(user.id, code);
  if (!hashesMatch(expected, incoming)) {
    await admin
      .from("admin_sms_challenges")
      .update({ attempts: attempts + 1 })
      .eq("id", challenge.id);
    return jsonErr("That code did not match. Try again.", 401);
  }

  await admin
    .from("admin_sms_challenges")
    .update({ consumed_at: new Date().toISOString(), attempts: attempts + 1 })
    .eq("id", challenge.id);

  await writeAudit({
    actorId: user.id,
    actorRole: role,
    action: "admin.session.start",
    resourceType: "admin",
    resourceId: "session",
    metadata: { method: "sms" },
    ip: requestIp(req),
    userAgent: requestUserAgent(req),
  });

  const now = Date.now();
  const res = NextResponse.json(
    {
      data: {
        role,
        email: maskEmail(user.email ?? ""),
        idleRemainingMs: ADMIN_IDLE_MS,
        absoluteRemainingMs: ADMIN_ABSOLUTE_MS,
      },
    },
    { status: 200 },
  );
  applyAdminSessionCookies(res, { now });
  return res;
}
