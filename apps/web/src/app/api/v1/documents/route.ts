import { NextRequest } from "next/server";
import { DOCUMENT_TYPES } from "@claimsaver/shared";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { jsonErr, jsonOk, requirePlatformAccess } from "@/lib/supabase/auth";

function toDoc(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    claimId: row.claim_id ? String(row.claim_id) : null,
    name: String(row.name),
    type: String(row.type),
    mimeType: String(row.mime_type),
    sizeBytes: Number(row.size_bytes) || 0,
    createdAt: String(row.created_at),
  };
}

export async function GET(req: NextRequest) {
  const { user, response } = await requirePlatformAccess(req);
  if (response) return response;
  if (!isSupabaseConfigured()) return jsonErr("Database not configured", 503);

  const claimId = req.nextUrl.searchParams.get("claimId");
  const admin = getSupabaseAdmin();
  let q = admin.from("claim_documents").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
  if (claimId) q = q.eq("claim_id", claimId);
  const { data, error } = await q;
  if (error) return jsonErr(error.message, 500);
  return jsonOk((data ?? []).map((r) => toDoc(r as Record<string, unknown>)));
}

export async function POST(req: NextRequest) {
  const { user, response } = await requirePlatformAccess(req);
  if (response) return response;
  if (!isSupabaseConfigured()) return jsonErr("Database not configured", 503);

  const form = await req.formData();
  const file = form.get("file");
  const name = String(form.get("name") || "");
  const type = String(form.get("type") || "other");
  const claimId = String(form.get("claimId") || "") || null;

  if (!(file instanceof File)) return jsonErr("Missing file");
  if (!DOCUMENT_TYPES.includes(type as (typeof DOCUMENT_TYPES)[number])) {
    return jsonErr("Invalid document type");
  }
  if (file.size > 50 * 1024 * 1024) return jsonErr("File must be 50MB or smaller");

  const admin = getSupabaseAdmin();
  const ext = file.name.split(".").pop() || "bin";
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());

  const { error: upErr } = await admin.storage
    .from("claim-documents")
    .upload(path, buf, { contentType: file.type || "application/octet-stream", upsert: false });
  if (upErr) return jsonErr(upErr.message, 500);

  const { data, error } = await admin
    .from("claim_documents")
    .insert({
      user_id: user.id,
      claim_id: claimId,
      name: name || file.name,
      type,
      mime_type: file.type || "application/octet-stream",
      size_bytes: file.size,
      storage_path: path,
    })
    .select("*")
    .single();

  if (error || !data) return jsonErr(error?.message || "Could not save document", 500);
  return jsonOk(toDoc(data as Record<string, unknown>), 201);
}
