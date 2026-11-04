import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { jsonErr, jsonOk } from "@/lib/supabase/auth";
import { requirePermission } from "@/lib/admin/require-permission";
import { writeAudit } from "@/lib/admin/audit";
import { requestIp, requestUserAgent } from "@/lib/admin/request-meta";
import { escapeIlikeExact, parseUserQuery } from "@/lib/admin/user-query";
import { PROFILE_COLUMNS, toStaffUserCard, type ProfileRow } from "@/lib/admin/staff-user";
import { rateLimit, rateLimitResponse, clientIp } from "@/lib/security/rate-limit";

export async function GET(req: NextRequest) {
  const limited = await rateLimit(`admin-users:${clientIp(req)}`, 40, 10 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);

  const { user, role, response } = await requirePermission(req, "users.search", {
    audit: false,
  });
  if (response) return response;

  const parsed = parseUserQuery(new URL(req.url).searchParams.get("q"));
  if (!parsed.ok) return jsonErr(parsed.error, 400);

  const admin = getSupabaseAdmin();
  let query = admin.from("profiles").select(PROFILE_COLUMNS);
  query =
    parsed.kind === "id"
      ? query.eq("id", parsed.value)
      : query.ilike("email", escapeIlikeExact(parsed.value));

  const { data, error } = await query.limit(5);
  if (error) return jsonErr(error.message, 500);

  const rows = (data ?? []) as ProfileRow[];
  await writeAudit({
    actorId: user.id,
    actorRole: role,
    action: "users.search",
    resourceType: "user",
    resourceId: rows[0]?.id ?? "",
    metadata: { kind: parsed.kind, hits: rows.length },
    ip: requestIp(req),
    userAgent: requestUserAgent(req),
  });

  return jsonOk({ users: rows.map((row) => toStaffUserCard(row)) });
}
