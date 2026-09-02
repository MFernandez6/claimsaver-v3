import { NextRequest } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { jsonErr, jsonOk, requireUser } from "@/lib/supabase/auth";

export async function POST(req: NextRequest) {
  const { user, response } = await requireUser(req);
  if (response) return response;
  if (!isSupabaseConfigured()) return jsonErr("Database not configured", 503);

  const admin = getSupabaseAdmin();
  const { error } = await admin.from("account_deletion_requests").insert({
    user_id: user.id,
    email: user.email || "",
    status: "pending",
  });
  if (error) return jsonErr(error.message, 500);
  return jsonOk({ ok: true });
}
