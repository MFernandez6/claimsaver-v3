import { createHash, randomBytes } from "node:crypto";
import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { jsonErr, jsonOk, requireUser } from "@/lib/supabase/auth";
import { writeAudit } from "@/lib/admin/audit";
import { requestIp, requestUserAgent } from "@/lib/admin/request-meta";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function POST(req: NextRequest) {
  const { user, response } = await requireUser(req);
  if (response) return response;

  const admin = getSupabaseAdmin();
  const [profile, consents, purchases, claims, tickets] = await Promise.all([
    admin.from("profiles").select("id, email, first_name, last_name, phone, created_at").eq("id", user.id).maybeSingle(),
    admin.from("legal_consents").select("document, version, source, accepted_at").eq("user_id", user.id),
    admin.from("purchases").select("product_code, amount_cents, status, created_at").eq("user_id", user.id),
    admin.from("claims").select("id, claim_number, status, worksheet_step, worksheet, created_at, updated_at").eq("user_id", user.id),
    admin.from("support_tickets").select("id, subject, status, created_at").eq("user_id", user.id),
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    account: profile.data,
    consents: consents.data ?? [],
    purchases: purchases.data ?? [],
    claims: claims.data ?? [],
    tickets: tickets.data ?? [],
  };

  const token = randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const { error } = await admin.from("privacy_exports").insert({
    user_id: user.id,
    status: "ready",
    download_token_hash: hashToken(token),
    payload,
    expires_at: expiresAt,
  });
  if (error) return jsonErr(error.message, 500);

  await writeAudit({
    actorId: user.id,
    actorRole: "CLAIMANT",
    action: "privacy.export",
    resourceType: "user",
    resourceId: user.id,
    ip: requestIp(req),
    userAgent: requestUserAgent(req),
  });

  return jsonOk({ token, expiresAt });
}

export async function GET(req: NextRequest) {
  const { user, response } = await requireUser(req);
  if (response) return response;

  const token = new URL(req.url).searchParams.get("token") ?? "";
  if (!token) return jsonErr("Missing token", 400);

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("privacy_exports")
    .select("id, user_id, status, payload, expires_at")
    .eq("download_token_hash", hashToken(token))
    .maybeSingle();
  if (error) return jsonErr(error.message, 500);
  if (!data || data.user_id !== user.id) return jsonErr("Not found", 404);
  if (Date.parse(String(data.expires_at)) < Date.now()) {
    await admin.from("privacy_exports").update({ status: "expired" }).eq("id", data.id);
    return jsonErr("This export expired. Request a new one.", 410);
  }

  await admin.from("privacy_exports").update({ status: "downloaded" }).eq("id", data.id);
  return jsonOk({ export: data.payload });
}
