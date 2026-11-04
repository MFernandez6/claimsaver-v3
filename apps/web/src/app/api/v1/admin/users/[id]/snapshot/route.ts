import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { jsonErr, jsonOk } from "@/lib/supabase/auth";
import { requirePermission } from "@/lib/admin/require-permission";
import { isUuid } from "@/lib/admin/user-query";

type Ctx = { params: Promise<{ id: string }> };

/** Read-only software snapshot. Never returns worksheet JSON or documents. */
export async function GET(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  if (!isUuid(id)) return jsonErr("Invalid user id", 400);

  const { response } = await requirePermission(req, "impersonate.breakglass", {
    resourceType: "user",
    resourceId: id,
  });
  if (response) return response;

  const admin = getSupabaseAdmin();
  const [{ data: profile }, { data: claims }, { count: docs }, { data: sessions }] =
    await Promise.all([
      admin
        .from("profiles")
        .select("id, is_active, has_platform_access, created_at")
        .eq("id", id)
        .maybeSingle(),
      admin
        .from("claims")
        .select("id, status, worksheet_step, updated_at")
        .eq("user_id", id)
        .order("updated_at", { ascending: false })
        .limit(5),
      admin
        .from("claim_documents")
        .select("id", { count: "exact", head: true })
        .eq("user_id", id)
        .then(({ count }) => ({ count })),
      admin
        .from("impersonation_sessions")
        .select("id, status, reason, requested_at, approved_at, expires_at")
        .eq("user_id", id)
        .order("requested_at", { ascending: false })
        .limit(5),
    ]);

  if (!profile) return jsonErr("Not found", 404);

  return jsonOk({
    isActive: profile.is_active,
    hasPlatformAccess: profile.has_platform_access,
    createdAt: profile.created_at,
    documentCount: docs ?? 0,
    claims: (claims ?? []).map((row) => ({
      status: row.status,
      step: row.worksheet_step,
      updatedAt: row.updated_at,
    })),
    sessions: sessions ?? [],
  });
}
