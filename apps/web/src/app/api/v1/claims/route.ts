import { NextRequest } from "next/server";
import { atIndividualClaimLimit, emptyWorksheet, normalizeAccidentDate } from "@claimsaver/shared";
import { syncPipDeadlineChain } from "@/lib/api/milestones";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { jsonErr, jsonOk, requirePlatformAccess } from "@/lib/supabase/auth";
import { generateClaimNumber } from "@/lib/utils";
import { clientIp, rateLimit, rateLimitResponse } from "@/lib/security/rate-limit";
import { stripClaimantSsn, toClaimDetail, toClaimSummary } from "@/lib/api/mappers";

export async function GET(req: NextRequest) {
  const { user, response } = await requirePlatformAccess(req);
  if (response) return response;
  if (!isSupabaseConfigured()) return jsonErr("Database not configured", 503);

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("claims")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) return jsonErr(error.message, 500);
  return jsonOk((data ?? []).map((row) => toClaimSummary(row as Record<string, unknown>)));
}

export async function POST(req: NextRequest) {
  const { user, response } = await requirePlatformAccess(req);
  if (response) return response;
  if (!isSupabaseConfigured()) return jsonErr("Database not configured", 503);

  const limited = await rateLimit(`claims:${user.id}:${clientIp(req)}`, 20, 10 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);

  const admin = getSupabaseAdmin();
  const { count: existingClaims, error: countError } = await admin
    .from("claims")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);
  if (countError) return jsonErr(countError.message, 500);
  if (atIndividualClaimLimit(existingClaims ?? 0)) {
    return jsonErr(
      "This purchase includes one claim workspace. Open your existing claim, or contact support if you need help.",
      409,
    );
  }

  const body = (await req.json().catch(() => ({}))) as { worksheet?: unknown };
  const worksheet = stripClaimantSsn({
    ...emptyWorksheet(),
    ...((body.worksheet ?? {}) as Record<string, unknown>),
  });

  let data: Record<string, unknown> | null = null;
  let error: { message: string } | null = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const inserted = await admin
      .from("claims")
      .insert({
        user_id: user.id,
        claim_number: generateClaimNumber(),
        status: "draft",
        priority: "medium",
        worksheet_step: 1,
        worksheet,
      })
      .select("*")
      .single();
    if (!inserted.error && inserted.data) {
      data = inserted.data as Record<string, unknown>;
      error = null;
      break;
    }
    error = inserted.error;
    if (!inserted.error?.message?.toLowerCase().includes("unique")) break;
  }

  if (error || !data) return jsonErr(error?.message || "Could not create claim", 500);
  const accidentDate = normalizeAccidentDate(worksheet);
  if (accidentDate) {
    await syncPipDeadlineChain(admin, user.id, String(data.id), accidentDate);
  }
  return jsonOk(toClaimDetail(data as Record<string, unknown>), 201);
}
