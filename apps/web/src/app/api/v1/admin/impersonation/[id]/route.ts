import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { jsonErr, jsonOk } from "@/lib/supabase/auth";
import { requirePermission } from "@/lib/admin/require-permission";
import { writeAudit } from "@/lib/admin/audit";
import { requestIp, requestUserAgent } from "@/lib/admin/request-meta";
import { isUuid } from "@/lib/admin/user-query";
import {
  IMPERSONATION_COOKIE,
  IMPERSONATION_MS,
  impersonationCookieOptions,
  clearImpersonationCookie,
} from "@/lib/admin/impersonation";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  if (!isUuid(id)) return jsonErr("Invalid session id", 400);

  const { user, role, response } = await requirePermission(req, "impersonate.breakglass", {
    audit: false,
  });
  if (response) return response;

  const body = (await req.json().catch(() => null)) as { action?: unknown } | null;
  const action = body?.action === "end" ? "end" : "join";
  const admin = getSupabaseAdmin();
  const { data: session, error } = await admin
    .from("impersonation_sessions")
    .select("id, staff_id, user_id, status, expires_at")
    .eq("id", id)
    .maybeSingle();
  if (error) return jsonErr(error.message, 500);
  if (!session) return jsonErr("Not found", 404);
  if (session.staff_id !== user.id && role !== "OWNER") {
    return jsonErr("Forbidden", 403);
  }

  if (action === "end") {
    await admin
      .from("impersonation_sessions")
      .update({ status: "ended", ended_at: new Date().toISOString() })
      .eq("id", id);
    await writeAudit({
      actorId: user.id,
      actorRole: role,
      action: "impersonation.end",
      resourceType: "user",
      resourceId: String(session.user_id),
      metadata: { sessionId: id },
      ip: requestIp(req),
      userAgent: requestUserAgent(req),
    });
    const res = NextResponse.json({ data: { ok: true, status: "ended" } });
    clearImpersonationCookie(res);
    return res;
  }

  if (session.status !== "active") {
    return jsonErr("The claimant has not approved this session", 403);
  }
  const expires = session.expires_at ? Date.parse(String(session.expires_at)) : 0;
  if (!expires || Date.now() > expires) {
    await admin.from("impersonation_sessions").update({ status: "expired" }).eq("id", id);
    return jsonErr("This support session expired", 403);
  }

  await writeAudit({
    actorId: user.id,
    actorRole: role,
    action: "impersonation.start",
    resourceType: "user",
    resourceId: String(session.user_id),
    metadata: { sessionId: id },
    ip: requestIp(req),
    userAgent: requestUserAgent(req),
  });

  const payload = {
    data: {
      ok: true,
      status: "active",
      userId: session.user_id,
      expiresAt: session.expires_at,
      remainingMs: Math.max(0, expires - Date.now()),
    },
  };
  const res = NextResponse.json(payload);
  res.cookies.set(IMPERSONATION_COOKIE, id, impersonationCookieOptions());
  void IMPERSONATION_MS;
  return res;
}
