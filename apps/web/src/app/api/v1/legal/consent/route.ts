import { NextRequest } from "next/server";
import { LEGAL_DOCUMENTS_VERSION } from "@claimsaver/shared";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { jsonErr, jsonOk, requireUser } from "@/lib/supabase/auth";
import { clientIp } from "@/lib/security/rate-limit";

const SOURCES = new Set(["signup", "checkout", "pricing", "reaccept", "callback"]);

export async function GET(req: NextRequest) {
  const { user, response } = await requireUser(req);
  if (response) return response;
  if (!isSupabaseConfigured()) return jsonErr("Database not configured", 503);

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("legal_consents")
    .select("document, version, accepted_at")
    .eq("user_id", user.id)
    .eq("version", LEGAL_DOCUMENTS_VERSION);
  if (error) return jsonErr(error.message, 500);

  const docs = new Set((data ?? []).map((row) => row.document));
  return jsonOk({
    version: LEGAL_DOCUMENTS_VERSION,
    current: docs.has("tos") && docs.has("privacy"),
  });
}

export async function POST(req: NextRequest) {
  const { user, response } = await requireUser(req);
  if (response) return response;
  if (!isSupabaseConfigured()) return jsonErr("Database not configured", 503);

  const body = (await req.json().catch(() => ({}))) as { source?: string };
  const version = LEGAL_DOCUMENTS_VERSION;
  const source = SOURCES.has(String(body.source)) ? String(body.source) : "signup";
  const admin = getSupabaseAdmin();
  const ip = clientIp(req);
  const userAgent = req.headers.get("user-agent") || "";

  const rows = (["tos", "privacy"] as const).map((document) => ({
    user_id: user.id,
    document,
    version,
    source,
    ip,
    user_agent: userAgent.slice(0, 500),
  }));

  const { error } = await admin.from("legal_consents").upsert(rows, {
    onConflict: "user_id,document,version",
  });
  if (error) return jsonErr(error.message, 500);
  return jsonOk({ ok: true, version });
}
