import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { jsonErr, jsonOk } from "@/lib/supabase/auth";
import { requirePermission } from "@/lib/admin/require-permission";
import { writeAudit } from "@/lib/admin/audit";
import { requestIp, requestUserAgent } from "@/lib/admin/request-meta";
import { isUuid } from "@/lib/admin/user-query";
import { PROFILE_COLUMNS, toStaffUserCard, type ProfileRow, type RevealFields } from "@/lib/admin/staff-user";
import { ADMIN, type RevealReasonId } from "@/content/admin";
import { rateLimit, rateLimitResponse, clientIp } from "@/lib/security/rate-limit";

type Ctx = { params: Promise<{ id: string }> };

const REASONS = new Set(ADMIN.revealReasons.map((item) => item.id));

export async function POST(req: NextRequest, ctx: Ctx) {
  const limited = await rateLimit(`admin-reveal:${clientIp(req)}`, 20, 10 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);

  const { id } = await ctx.params;
  if (!isUuid(id)) return jsonErr("Invalid user id", 400);

  const { user, role, response } = await requirePermission(req, "users.reveal", {
    audit: false,
  });
  if (response) return response;

  const body = (await req.json().catch(() => null)) as {
    reason?: unknown;
    fields?: unknown;
  } | null;
  const reason = typeof body?.reason === "string" ? body.reason : "";
  if (!REASONS.has(reason as RevealReasonId)) {
    return jsonErr("A listed reveal reason is required", 400);
  }

  const fields: RevealFields = { email: true, phone: true, name: true };
  if (body?.fields && typeof body.fields === "object") {
    const requested = body.fields as RevealFields;
    fields.email = Boolean(requested.email);
    fields.phone = Boolean(requested.phone);
    fields.name = Boolean(requested.name);
    if (!fields.email && !fields.phone && !fields.name) {
      return jsonErr("Select at least one field to reveal", 400);
    }
  }

  const { data, error } = await getSupabaseAdmin()
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) return jsonErr(error.message, 500);
  if (!data) return jsonErr("Not found", 404);

  await writeAudit({
    actorId: user.id,
    actorRole: role,
    action: "users.reveal",
    resourceType: "user",
    resourceId: id,
    metadata: { reason, fields },
    ip: requestIp(req),
    userAgent: requestUserAgent(req),
  });

  return jsonOk({
    user: toStaffUserCard(data as ProfileRow, fields),
    reason,
  });
}
