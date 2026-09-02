import { NextRequest } from "next/server";
import { DOCUMENT_TYPES } from "@claimsaver/shared";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { jsonErr, jsonOk, requirePlatformAccess } from "@/lib/supabase/auth";
import { resolveOwnedClaimId } from "@/lib/api/owned-claim";
import { clientIp, rateLimit, rateLimitResponse } from "@/lib/security/rate-limit";
import { resolveUploadType } from "@/lib/security/upload-mime";

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

  const limited = await rateLimit(`upload:${user.id}:${clientIp(req)}`, 30, 10 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);

  const form = await req.formData();
  const file = form.get("file");
  const name = String(form.get("name") || "");
  const type = String(form.get("type") || "other");
  const rawClaimId = String(form.get("claimId") || "") || null;

  if (!(file instanceof File)) return jsonErr("Missing file");
  if (!DOCUMENT_TYPES.includes(type as (typeof DOCUMENT_TYPES)[number])) {
    return jsonErr("Invalid document type");
  }
  if (file.size > 50 * 1024 * 1024) return jsonErr("File must be 50MB or smaller");

  const admin = getSupabaseAdmin();
  const owned = await resolveOwnedClaimId(admin, user.id, rawClaimId);
  if (owned.error) return jsonErr(owned.error, 404);

  const buf = Buffer.from(await file.arrayBuffer());
  const resolved = resolveUploadType(buf, file.type || "");
  if (!resolved) {
    return jsonErr("File type not allowed. Use PDF, JPEG, PNG, WebP, HEIC, DOC, or DOCX.");
  }

  const path = `${user.id}/${crypto.randomUUID()}.${resolved.ext}`;
  const { error: upErr } = await admin.storage
    .from("claim-documents")
    .upload(path, buf, { contentType: resolved.mime, upsert: false });
  if (upErr) return jsonErr(upErr.message, 500);

  const { data, error } = await admin
    .from("claim_documents")
    .insert({
      user_id: user.id,
      claim_id: owned.claimId,
      name: name || file.name,
      type,
      mime_type: resolved.mime,
      size_bytes: file.size,
      storage_path: path,
    })
    .select("*")
    .single();

  if (error || !data) return jsonErr(error?.message || "Could not save document", 500);
  return jsonOk(toDoc(data as Record<string, unknown>), 201);
}
