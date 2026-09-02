import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { jsonErr, jsonOk, requirePlatformAccess } from "@/lib/supabase/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const { user, response } = await requirePlatformAccess(req);
  if (response) return response;
  const { id } = await ctx.params;
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("claim_documents")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) return jsonErr(error.message, 500);
  if (!data) return jsonErr("Not found", 404);

  const { data: signed, error: signErr } = await admin.storage
    .from("claim-documents")
    .createSignedUrl(String(data.storage_path), 300);
  if (signErr || !signed?.signedUrl) return jsonErr("Could not create download link", 500);
  return jsonOk({ url: signed.signedUrl, name: data.name, mimeType: data.mime_type });
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { user, response } = await requirePlatformAccess(req);
  if (response) return response;
  const { id } = await ctx.params;
  const admin = getSupabaseAdmin();
  const { data } = await admin
    .from("claim_documents")
    .select("storage_path")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!data) return jsonErr("Not found", 404);
  await admin.storage.from("claim-documents").remove([String(data.storage_path)]);
  await admin.from("claim_documents").delete().eq("id", id).eq("user_id", user.id);
  return jsonOk({ ok: true });
}
