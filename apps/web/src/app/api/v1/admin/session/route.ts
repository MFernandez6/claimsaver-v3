import { NextRequest, NextResponse } from "next/server";
import { jsonErr, jsonOk } from "@/lib/supabase/auth";
import { requirePermission, requireFreshTotp, requireStaff } from "@/lib/admin/require-permission";
import { writeAudit } from "@/lib/admin/audit";
import { requestIp, requestUserAgent } from "@/lib/admin/request-meta";
import { maskEmail } from "@/lib/auth/mask";
import {
  ADMIN_ABSOLUTE_MS,
  ADMIN_ABS_COOKIE,
  ADMIN_IDLE_COOKIE,
  ADMIN_IDLE_MS,
  applyAdminSessionCookies,
  parseCookieTime,
  remainingMs,
} from "@/lib/auth/admin-session";
import { rateLimit, rateLimitResponse, clientIp } from "@/lib/security/rate-limit";
import { impersonationIdFromRequest } from "@/lib/admin/impersonation";

export async function GET(req: NextRequest) {
  const { user, role, response } = await requirePermission(req, "admin.access", {
    audit: false,
  });
  if (response) return response;
  const now = Date.now();
  const idleAt = parseCookieTime(req.cookies.get(ADMIN_IDLE_COOKIE)?.value);
  const absAt = parseCookieTime(req.cookies.get(ADMIN_ABS_COOKIE)?.value);
  return jsonOk({
    role,
    email: maskEmail(user.email ?? ""),
    idleRemainingMs: remainingMs(idleAt, ADMIN_IDLE_MS, now),
    absoluteRemainingMs: remainingMs(absAt, ADMIN_ABSOLUTE_MS, now),
    impersonating: Boolean(impersonationIdFromRequest(req)),
  });
}

export async function POST(req: NextRequest) {
  const limited = await rateLimit(`admin-session:${clientIp(req)}`, 10, 10 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);

  const { user, role, response } = await requireStaff(req);
  if (response) return response;

  const fresh = await requireFreshTotp(req);
  if (!fresh) {
    return jsonErr("Authenticator code required", 401);
  }

  await writeAudit({
    actorId: user.id,
    actorRole: role,
    action: "admin.session.start",
    resourceType: "admin",
    resourceId: "session",
    ip: requestIp(req),
    userAgent: requestUserAgent(req),
  });

  const now = Date.now();
  const payload = {
    data: {
      role,
      email: maskEmail(user.email ?? ""),
      idleRemainingMs: ADMIN_IDLE_MS,
      absoluteRemainingMs: ADMIN_ABSOLUTE_MS,
    },
  };
  const res = NextResponse.json(payload, { status: 200 });
  applyAdminSessionCookies(res, { now });
  return res;
}
