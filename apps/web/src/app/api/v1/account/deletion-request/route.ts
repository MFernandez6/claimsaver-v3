import { NextRequest } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { jsonErr, jsonOk, requireUser } from "@/lib/supabase/auth";
import { clientIp, rateLimit, rateLimitResponse } from "@/lib/security/rate-limit";

export async function POST(req: NextRequest) {
  const { user, response } = await requireUser(req);
  if (response) return response;
  if (!isSupabaseConfigured()) return jsonErr("Database not configured", 503);

  const limited = await rateLimit(`deletion:${user.id}:${clientIp(req)}`, 3, 10 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);

  const admin = getSupabaseAdmin();
  const { data: existing, error: findErr } = await admin
    .from("account_deletion_requests")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "pending")
    .maybeSingle();
  if (findErr) return jsonErr(findErr.message, 500);
  if (existing) return jsonOk({ ok: true, alreadyPending: true });

  const { error } = await admin.from("account_deletion_requests").insert({
    user_id: user.id,
    email: user.email || "",
    status: "pending",
  });
  if (error) {
    if (error.code === "23505") return jsonOk({ ok: true, alreadyPending: true });
    return jsonErr(error.message, 500);
  }
  return jsonOk({ ok: true });
}
