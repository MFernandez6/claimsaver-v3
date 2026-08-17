import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { jsonErr, jsonOk, requirePlatformAccess } from "@/lib/supabase/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { user, response } = await requirePlatformAccess(req);
  if (response) return response;
  const { id } = await ctx.params;
  const { error } = await getSupabaseAdmin()
    .from("expenses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return jsonErr(error.message, 500);
  return jsonOk({ ok: true });
}
