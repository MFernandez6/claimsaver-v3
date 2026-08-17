import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { jsonErr, jsonOk, requireAdmin } from "@/lib/supabase/auth";

export async function GET(req: NextRequest) {
  const { response } = await requireAdmin(req);
  if (response) return response;
  const admin = getSupabaseAdmin();
  const [{ data: users, error: uErr }, { data: claims, error: cErr }] = await Promise.all([
    admin
      .from("profiles")
      .select("id,email,first_name,last_name,role,has_platform_access,created_at")
      .order("created_at", { ascending: false })
      .limit(200),
    admin
      .from("claims")
      .select("id,user_id,claim_number,status,updated_at")
      .order("updated_at", { ascending: false })
      .limit(200),
  ]);
  if (uErr || cErr) return jsonErr(uErr?.message || cErr?.message || "Error", 500);
  return jsonOk({ users: users ?? [], claims: claims ?? [] });
}
