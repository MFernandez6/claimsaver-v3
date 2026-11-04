import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { jsonErr, jsonOk } from "@/lib/supabase/auth";
import { requirePermission, requireFreshTotp } from "@/lib/admin/require-permission";
import { writeAudit } from "@/lib/admin/audit";
import { requestIp, requestUserAgent } from "@/lib/admin/request-meta";
import { isUuid } from "@/lib/admin/user-query";
import { PROFILE_COLUMNS, toStaffUserCard, type ProfileRow } from "@/lib/admin/staff-user";
import { rateLimit, rateLimitResponse, clientIp } from "@/lib/security/rate-limit";

type Ctx = { params: Promise<{ id: string }> };

async function loadProfile(id: string): Promise<ProfileRow | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as ProfileRow | null) ?? null;
}

export async function GET(req: NextRequest, ctx: Ctx) {
  const limited = await rateLimit(`admin-user:${clientIp(req)}`, 40, 10 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);

  const { id } = await ctx.params;
  if (!isUuid(id)) return jsonErr("Invalid user id", 400);

  const { user, role, response } = await requirePermission(req, "users.search", {
    resourceType: "user",
    resourceId: id,
  });
  if (response) return response;

  try {
    const profile = await loadProfile(id);
    if (!profile) return jsonErr("Not found", 404);

    const admin = getSupabaseAdmin();
    const [
      claimCount,
      consents,
      purchases,
      tickets,
      authUser,
    ] = await Promise.all([
      admin
        .from("claims")
        .select("id", { count: "exact", head: true })
        .eq("user_id", id)
        .then(({ count, error }) => {
          if (error) throw new Error(error.message);
          return count ?? 0;
        }),
      admin
        .from("legal_consents")
        .select("document, version, accepted_at, source")
        .eq("user_id", id)
        .order("accepted_at", { ascending: false })
        .limit(20)
        .then(({ data, error }) => {
          if (error) throw new Error(error.message);
          return data ?? [];
        }),
      admin
        .from("purchases")
        .select("id, product_code, amount_cents, status, created_at")
        .eq("user_id", id)
        .order("created_at", { ascending: false })
        .limit(20)
        .then(({ data, error }) => {
          if (error) throw new Error(error.message);
          return data ?? [];
        }),
      admin
        .from("support_tickets")
        .select("id, subject, status, priority, created_at")
        .eq("user_id", id)
        .order("created_at", { ascending: false })
        .limit(20)
        .then(({ data, error }) => {
          if (error) return [];
          return data ?? [];
        }),
      admin.auth.admin.getUserById(id).then(({ data, error }) => {
        if (error) return null;
        return data.user ?? null;
      }),
    ]);

    return jsonOk({
      user: toStaffUserCard(profile),
      actorRole: role,
      actorId: user.id,
      claimRecordCount: claimCount,
      lastSignInAt: authUser?.last_sign_in_at ?? null,
      emailVerified: Boolean(authUser?.email_confirmed_at),
      consents,
      purchases,
      tickets,
      clinicEnrollments: await admin
        .from("clinic_enrollments")
        .select("clinic_id, enrolled_at, clinics(legal_name)")
        .eq("user_id", id)
        .then(({ data, error }) => {
          if (error) return [];
          return (data ?? []).map((row) => {
            const clinic = row.clinics as { legal_name?: string } | { legal_name?: string }[] | null;
            const name = Array.isArray(clinic) ? clinic[0]?.legal_name : clinic?.legal_name;
            return {
              clinicName: name ?? "Clinic",
              enrolledAt: row.enrolled_at,
            };
          });
        }),
    });
  } catch (err) {
    return jsonErr(err instanceof Error ? err.message : "Error", 500);
  }
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const limited = await rateLimit(`admin-user-write:${clientIp(req)}`, 20, 10 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);

  const { id } = await ctx.params;
  if (!isUuid(id)) return jsonErr("Invalid user id", 400);

  const { user, role, response } = await requirePermission(req, "users.disable", {
    audit: false,
  });
  if (response) return response;

  const fresh = await requireFreshTotp(req);
  if (!fresh) return jsonErr("Authenticator code required", 401);

  const body = (await req.json().catch(() => null)) as { isActive?: unknown } | null;
  if (typeof body?.isActive !== "boolean") return jsonErr("isActive is required", 400);

  const profile = await loadProfile(id);
  if (!profile) return jsonErr("Not found", 404);

  const { error } = await getSupabaseAdmin()
    .from("profiles")
    .update({ is_active: body.isActive, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return jsonErr(error.message, 500);

  await writeAudit({
    actorId: user.id,
    actorRole: role,
    action: body.isActive ? "users.enable" : "users.disable",
    resourceType: "user",
    resourceId: id,
    metadata: { isActive: body.isActive },
    ip: requestIp(req),
    userAgent: requestUserAgent(req),
  });

  const next = await loadProfile(id);
  return jsonOk({ user: next ? toStaffUserCard(next) : null });
}
