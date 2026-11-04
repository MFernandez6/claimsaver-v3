import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { jsonErr, jsonOk } from "@/lib/supabase/auth";
import { requirePermission } from "@/lib/admin/require-permission";
import { maskEmail } from "@/lib/auth/mask";
import { rateLimit, rateLimitResponse, clientIp } from "@/lib/security/rate-limit";

export async function GET(req: NextRequest) {
  const limited = await rateLimit(`admin-privacy:${clientIp(req)}`, 30, 10 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);

  const { response } = await requirePermission(req, "privacy.deletion.view", {
    resourceType: "privacy",
    resourceId: "list",
  });
  if (response) return response;

  const [{ data: deletions, error }, { data: exports }] = await Promise.all([
    getSupabaseAdmin()
      .from("account_deletion_requests")
      .select(
        "id, user_id, email, status, created_at, approved_at, hard_delete_after, processed_at",
      )
      .order("created_at", { ascending: false })
      .limit(100),
    getSupabaseAdmin()
      .from("privacy_exports")
      .select("id, user_id, status, created_at, expires_at")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);
  if (error) return jsonErr(error.message, 500);

  return jsonOk({
    requests: (deletions ?? []).map((row) => ({
      id: row.id,
      userId: row.user_id,
      email: maskEmail(String(row.email ?? "")),
      status: row.status,
      createdAt: row.created_at,
      approvedAt: row.approved_at,
      hardDeleteAfter: row.hard_delete_after,
      processedAt: row.processed_at,
    })),
    exports: (exports ?? []).map((row) => ({
      id: row.id,
      userId: row.user_id,
      status: row.status,
      createdAt: row.created_at,
      expiresAt: row.expires_at,
    })),
  });
}
