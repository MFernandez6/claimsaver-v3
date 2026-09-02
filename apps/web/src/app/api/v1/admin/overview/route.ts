import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { jsonErr, jsonOk, requireAdmin } from "@/lib/supabase/auth";

export async function GET(req: NextRequest) {
  const { response } = await requireAdmin(req);
  if (response) return response;
  const admin = getSupabaseAdmin();
  const [{ data: users, error: uErr }, { data: claims, error: cErr }, { data: deletions, error: dErr }] =
    await Promise.all([
      admin
        .from("profiles")
        .select("id,email,first_name,last_name,role,has_platform_access,is_active,created_at")
        .order("created_at", { ascending: false })
        .limit(200),
      admin
        .from("claims")
        .select("id,user_id,claim_number,status,updated_at")
        .order("updated_at", { ascending: false })
        .limit(200),
      admin
        .from("account_deletion_requests")
        .select("id,user_id,email,status,created_at,processed_at")
        .order("created_at", { ascending: false })
        .limit(100),
    ]);
  if (uErr || cErr || dErr) return jsonErr(uErr?.message || cErr?.message || dErr?.message || "Error", 500);
  return jsonOk({ users: users ?? [], claims: claims ?? [], deletions: deletions ?? [] });
}
