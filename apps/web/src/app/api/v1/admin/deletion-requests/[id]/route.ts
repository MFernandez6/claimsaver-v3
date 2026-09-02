import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { fulfillAccountDeletion } from "@/lib/api/fulfill-deletion";
import { jsonErr, jsonOk, requireAdmin } from "@/lib/supabase/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  const { user, response } = await requireAdmin(req);
  if (response) return response;
  const { id } = await ctx.params;
  const admin = getSupabaseAdmin();
  const { data: row, error } = await admin
    .from("account_deletion_requests")
    .select("id,user_id,status")
    .eq("id", id)
    .maybeSingle();
  if (error) return jsonErr(error.message, 500);
  if (!row) return jsonErr("Not found", 404);
  if (row.status === "done") return jsonOk({ ok: true, alreadyDone: true });

  try {
    await fulfillAccountDeletion(admin, String(row.user_id), String(row.id), user.id);
  } catch (err) {
    return jsonErr(err instanceof Error ? err.message : "Could not fulfill deletion", 500);
  }
  return jsonOk({ ok: true });
}
