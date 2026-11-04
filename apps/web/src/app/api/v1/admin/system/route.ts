import { NextRequest } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { jsonErr, jsonOk } from "@/lib/supabase/auth";
import { requirePermission, requireFreshTotp } from "@/lib/admin/require-permission";
import { writeAudit } from "@/lib/admin/audit";
import { requestIp, requestUserAgent } from "@/lib/admin/request-meta";
import { retentionYears } from "@/lib/admin/retention";

export async function GET(req: NextRequest) {
  const { response } = await requirePermission(req, "admin.overview", {
    resourceType: "admin",
    resourceId: "system",
  });
  if (response) return response;

  const [{ data: lastCron }, { data: lock }, { count: failedMail }] = await Promise.all([
    getSupabaseAdmin()
      .from("cron_runs")
      .select("job, ran_at, counts")
      .order("ran_at", { ascending: false })
      .limit(5),
    getSupabaseAdmin().from("admin_ops_state").select("admin_revoked_at").eq("id", 1).maybeSingle(),
    getSupabaseAdmin()
      .from("support_messages")
      .select("id", { count: "exact", head: true })
      .eq("email_status", "failed")
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .then(({ count, error }) => ({ count: error ? 0 : count ?? 0 })),
  ]);

  return jsonOk({
    database: isSupabaseConfigured(),
    retentionYears: retentionYears(),
    failedMessages24h: failedMail,
    lastCron: lastCron ?? [],
    lastRevokedAt: lock?.admin_revoked_at ?? null,
  });
}

export async function POST(req: NextRequest) {
  const { user, role, response } = await requirePermission(req, "roles.assign", {
    audit: false,
  });
  if (response) return response;

  const fresh = await requireFreshTotp(req);
  if (!fresh) return jsonErr("Authenticator code required", 401);

  const body = (await req.json().catch(() => null)) as { action?: unknown } | null;
  if (body?.action !== "revoke_admin_sessions") {
    return jsonErr("Unknown system action", 400);
  }

  const now = new Date().toISOString();
  await getSupabaseAdmin()
    .from("admin_ops_state")
    .upsert({ id: 1, admin_revoked_at: now, revoked_by: user.id });

  const { data: staff } = await getSupabaseAdmin()
    .from("user_roles")
    .select("user_id")
    .in("role", ["OWNER", "SUPPORT"]);
  for (const row of staff ?? []) {
    await getSupabaseAdmin().auth.admin.signOut(String(row.user_id), "global").catch(() => undefined);
  }

  await writeAudit({
    actorId: user.id,
    actorRole: role,
    action: "admin.sessions.revoke",
    resourceType: "admin",
    resourceId: "emergency",
    ip: requestIp(req),
    userAgent: requestUserAgent(req),
  });

  return jsonOk({ ok: true, revokedAt: now });
}
