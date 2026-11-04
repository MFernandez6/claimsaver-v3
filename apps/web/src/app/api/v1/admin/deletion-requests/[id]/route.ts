import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { jsonErr, jsonOk } from "@/lib/supabase/auth";
import { requirePermission } from "@/lib/admin/require-permission";
import { writeAudit } from "@/lib/admin/audit";
import { requestIp, requestUserAgent } from "@/lib/admin/request-meta";
import { isUuid } from "@/lib/admin/user-query";
import { deletionDueIso } from "@/lib/admin/retention";
import { rateLimit, rateLimitResponse, clientIp } from "@/lib/security/rate-limit";

type Ctx = { params: Promise<{ id: string }> };

/** OWNER schedules deletion: disable now, hard-delete after 30 days. Never immediate wipe. */
export async function POST(req: NextRequest, ctx: Ctx) {
  const limited = await rateLimit(`admin-deletion:${clientIp(req)}`, 10, 10 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);

  const { id } = await ctx.params;
  if (!isUuid(id)) return jsonErr("Invalid request id", 400);

  const { user, role, response } = await requirePermission(req, "privacy.deletion.approve", {
    audit: false,
  });
  if (response) return response;

  const admin = getSupabaseAdmin();
  const { data: row, error } = await admin
    .from("account_deletion_requests")
    .select("id, user_id, status")
    .eq("id", id)
    .maybeSingle();
  if (error) return jsonErr(error.message, 500);
  if (!row) return jsonErr("Not found", 404);
  if (row.status === "done") return jsonErr("Already completed", 400);

  const now = new Date();
  const due = deletionDueIso(now);

  await admin
    .from("profiles")
    .update({
      is_active: false,
      has_platform_access: false,
      updated_at: now.toISOString(),
    })
    .eq("id", row.user_id);

  await admin.auth.admin.signOut(row.user_id as string, "global").catch(() => undefined);

  const { error: updateError } = await admin
    .from("account_deletion_requests")
    .update({
      status: "processing",
      approved_at: now.toISOString(),
      approved_by: user.id,
      hard_delete_after: due,
    })
    .eq("id", id);
  if (updateError) return jsonErr(updateError.message, 500);

  await writeAudit({
    actorId: user.id,
    actorRole: role,
    action: "privacy.delete.schedule",
    resourceType: "account_deletion_request",
    resourceId: id,
    metadata: { hardDeleteAfter: due },
    ip: requestIp(req),
    userAgent: requestUserAgent(req),
  });

  return jsonOk({ status: "processing", hardDeleteAfter: due });
}
