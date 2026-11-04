import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { jsonErr, jsonOk } from "@/lib/supabase/auth";
import { requirePermission, requireFreshTotp } from "@/lib/admin/require-permission";
import { writeAudit } from "@/lib/admin/audit";
import { requestIp, requestUserAgent } from "@/lib/admin/request-meta";
import { escapeIlikeExact, parseUserQuery } from "@/lib/admin/user-query";
import { maskEmail } from "@/lib/auth/mask";
import { rateLimit, rateLimitResponse, clientIp } from "@/lib/security/rate-limit";

type RoleRow = {
  id: string;
  user_id: string;
  role: string;
  clinic_id: string | null;
  created_at: string;
};

export async function GET(req: NextRequest) {
  const { response } = await requirePermission(req, "roles.assign", {
    resourceType: "role",
    resourceId: "list",
  });
  if (response) return response;

  const { data, error } = await getSupabaseAdmin()
    .from("user_roles")
    .select("id, user_id, role, clinic_id, created_at")
    .in("role", ["OWNER", "SUPPORT", "CLINIC_ADMIN", "CLINIC_STAFF"])
    .order("created_at", { ascending: true });
  if (error) return jsonErr(error.message, 500);

  const rows = (data ?? []) as RoleRow[];
  const ids = rows.map((row) => row.user_id);
  const emails = new Map<string, string>();
  if (ids.length) {
    const { data: profiles } = await getSupabaseAdmin()
      .from("profiles")
      .select("id, email")
      .in("id", ids);
    for (const row of profiles ?? []) {
      emails.set(row.id as string, maskEmail(String(row.email ?? "")));
    }
  }

  return jsonOk({
    staff: rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      role: row.role,
      clinicId: row.clinic_id,
      email: emails.get(row.user_id) ?? "***",
      createdAt: row.created_at,
    })),
  });
}

export async function POST(req: NextRequest) {
  const limited = await rateLimit(`admin-roles:${clientIp(req)}`, 10, 10 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);

  const { user, role, response } = await requirePermission(req, "roles.assign", {
    audit: false,
  });
  if (response) return response;

  const fresh = await requireFreshTotp(req);
  if (!fresh) return jsonErr("Authenticator code required", 401);

  const body = (await req.json().catch(() => null)) as {
    email?: unknown;
    role?: unknown;
    clinicId?: unknown;
  } | null;
  const assigned = body?.role === "CLINIC_ADMIN" ? "CLINIC_ADMIN" : body?.role === "SUPPORT" ? "SUPPORT" : "";
  if (!assigned) {
    return jsonErr("Invite SUPPORT or CLINIC_ADMIN. OWNER is seeded, not invited.", 400);
  }
  const clinicId = typeof body?.clinicId === "string" ? body.clinicId : "";
  if (assigned === "CLINIC_ADMIN" && !clinicId) {
    return jsonErr("CLINIC_ADMIN requires a clinic", 400);
  }
  const parsed = parseUserQuery(typeof body?.email === "string" ? body.email : "");
  if (!parsed.ok || parsed.kind !== "email") {
    return jsonErr("Invite with an exact email address", 400);
  }

  const admin = getSupabaseAdmin();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || new URL(req.url).origin;

  let targetId: string | null = null;
  const { data: existing } = await admin
    .from("profiles")
    .select("id")
    .ilike("email", escapeIlikeExact(parsed.value))
    .maybeSingle();
  if (existing?.id) {
    targetId = existing.id as string;
  } else {
    const invited = await admin.auth.admin.inviteUserByEmail(parsed.value, {
      redirectTo: assigned === "CLINIC_ADMIN" ? `${origin}/clinic` : `${origin}/admin`,
    });
    if (invited.error || !invited.data.user) {
      return jsonErr(invited.error?.message ?? "Invite failed", 400);
    }
    targetId = invited.data.user.id;
  }

  const { error } = await admin.from("user_roles").insert({
    user_id: targetId,
    role: assigned,
    clinic_id: assigned === "CLINIC_ADMIN" ? clinicId : null,
    created_by: user.id,
  });
  if (error) {
    if (error.code === "23505") return jsonErr("That account already has a staff role", 409);
    return jsonErr(error.message, 500);
  }

  await writeAudit({
    actorId: user.id,
    actorRole: role,
    action: "roles.assign",
    resourceType: "user",
    resourceId: targetId,
    metadata: { assigned },
    ip: requestIp(req),
    userAgent: requestUserAgent(req),
  });

  return jsonOk({ userId: targetId, role: assigned }, 201);
}
