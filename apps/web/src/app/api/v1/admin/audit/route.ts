import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { jsonErr, jsonOk } from "@/lib/supabase/auth";
import { requirePermission } from "@/lib/admin/require-permission";
import { maskEmail } from "@/lib/auth/mask";
import { rateLimit, rateLimitResponse, clientIp } from "@/lib/security/rate-limit";

export async function GET(req: NextRequest) {
  const limited = await rateLimit(`admin-audit:${clientIp(req)}`, 30, 10 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);

  const { response } = await requirePermission(req, "audit.read", {
    resourceType: "audit",
    resourceId: "list",
  });
  if (response) return response;

  const url = new URL(req.url);
  const action = (url.searchParams.get("action") ?? "").trim();
  const before = (url.searchParams.get("before") ?? "").trim();

  let query = getSupabaseAdmin()
    .from("audit_events")
    .select("id, actor_id, actor_role, action, resource_type, resource_id, created_at, ip")
    .order("created_at", { ascending: false })
    .limit(80);
  if (action) query = query.eq("action", action);
  if (before) query = query.lt("created_at", before);

  const { data, error } = await query;
  if (error) return jsonErr(error.message, 500);

  const rows = data ?? [];
  const actorIds = [...new Set(rows.map((row) => row.actor_id).filter(Boolean))] as string[];
  const emails = new Map<string, string>();
  if (actorIds.length) {
    const { data: profiles } = await getSupabaseAdmin()
      .from("profiles")
      .select("id, email")
      .in("id", actorIds);
    for (const row of profiles ?? []) {
      emails.set(row.id as string, maskEmail(String(row.email ?? "")));
    }
  }

  return jsonOk({
    events: rows.map((row) => ({
      id: row.id,
      actorId: row.actor_id,
      actorEmail: row.actor_id ? emails.get(row.actor_id as string) ?? "***" : "system",
      actorRole: row.actor_role,
      action: row.action,
      resourceType: row.resource_type,
      resourceId: row.resource_id,
      createdAt: row.created_at,
      ip: row.ip ? `${String(row.ip).slice(0, 8)}…` : "",
    })),
  });
}
