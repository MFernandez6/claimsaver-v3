import { NextRequest } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { jsonErr, jsonOk } from "@/lib/supabase/auth";
import { requirePermission } from "@/lib/admin/require-permission";
import { maskEmail } from "@/lib/auth/mask";
import { weekAgoIso } from "@/lib/admin/user-query";
import { rateLimit, rateLimitResponse, clientIp } from "@/lib/security/rate-limit";

async function countExact(
  table: string,
  extra?: { column: string; op: "gte" | "neq"; value: string },
) {
  let query = getSupabaseAdmin()
    .from(table)
    .select("id", { count: "exact", head: true });
  if (extra?.op === "gte") query = query.gte(extra.column, extra.value);
  if (extra?.op === "neq") query = query.neq(extra.column, extra.value);
  const { count, error } = await query;
  if (error) throw new Error(error.message);
  return count ?? 0;
}

async function countOrZero(
  table: string,
  extra?: { column: string; op: "gte" | "neq"; value: string },
) {
  try {
    return await countExact(table, extra);
  } catch {
    return 0;
  }
}

export async function GET(req: NextRequest) {
  const limited = await rateLimit(`admin-overview:${clientIp(req)}`, 60, 10 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);

  const { user, role, response } = await requirePermission(req, "admin.overview", {
    resourceType: "admin",
    resourceId: "overview",
  });
  if (response) return response;

  const since = weekAgoIso();

  try {
    const [
      users,
      usersNewWeek,
      claims,
      pendingDeletions,
      leads,
      leadsWeek,
      openTickets,
      staff,
      clinics,
      pilots,
      lastAudit,
    ] = await Promise.all([
      countExact("profiles"),
      countExact("profiles", { column: "created_at", op: "gte", value: since }),
      countExact("claims"),
      countExact("account_deletion_requests", {
        column: "status",
        op: "neq",
        value: "done",
      }),
      countOrZero("leads_14days"),
      countOrZero("leads_14days", { column: "created_at", op: "gte", value: since }),
      countOrZero("support_tickets", { column: "status", op: "neq", value: "closed" }),
      countOrZero("user_roles"),
      countOrZero("clinics"),
      getSupabaseAdmin()
        .from("clinics")
        .select("id", { count: "exact", head: true })
        .eq("plan", "PILOT")
        .then(({ count, error }) => (error ? 0 : count ?? 0)),
      getSupabaseAdmin()
        .from("audit_events")
        .select("created_at")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
        .then(({ data }) => (data?.created_at as string | undefined) ?? null),
    ]);

    return jsonOk({
      actor: { role, email: maskEmail(user.email ?? "") },
      counts: {
        users,
        usersNewWeek,
        claims,
        pendingDeletions,
        leads14days: leads,
        leads14daysWeek: leadsWeek,
        openTickets,
        staff,
        clinics,
        pilots,
      },
      health: {
        database: isSupabaseConfigured(),
        lastAuditAt: lastAudit,
        messaging: "in-console",
      },
    });
  } catch (err) {
    return jsonErr(err instanceof Error ? err.message : "Error", 500);
  }
}
