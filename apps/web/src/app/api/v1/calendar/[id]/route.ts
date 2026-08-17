import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { jsonErr, jsonOk, requirePlatformAccess } from "@/lib/supabase/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { user, response } = await requirePlatformAccess(req);
  if (response) return response;
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as { completed?: boolean };
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("calendar_events")
    .update({
      completed: Boolean(body.completed),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .maybeSingle();
  if (error) return jsonErr(error.message, 500);
  if (!data) return jsonErr("Not found", 404);
  return jsonOk({
    id: data.id,
    completed: data.completed,
  });
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { user, response } = await requirePlatformAccess(req);
  if (response) return response;
  const { id } = await ctx.params;
  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("calendar_events")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return jsonErr(error.message, 500);
  return jsonOk({ ok: true });
}
