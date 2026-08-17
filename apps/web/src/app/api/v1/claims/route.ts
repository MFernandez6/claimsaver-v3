import { NextRequest } from "next/server";
import { emptyWorksheet, normalizeAccidentDate } from "@claimsaver/shared";
import { syncPipDeadlineChain } from "@/lib/api/milestones";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { jsonErr, jsonOk, requirePlatformAccess } from "@/lib/supabase/auth";
import { generateClaimNumber } from "@/lib/utils";
import { toClaimDetail, toClaimSummary } from "@/lib/api/mappers";

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

  const body = (await req.json().catch(() => ({}))) as { worksheet?: unknown };
  const worksheet = { ...emptyWorksheet(), ...(body.worksheet ?? {}) };

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
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

  if (error || !data) return jsonErr(error?.message || "Could not create claim", 500);
  const accidentDate = normalizeAccidentDate(worksheet);
  if (accidentDate) {
    await syncPipDeadlineChain(admin, user.id, String(data.id), accidentDate);
  }
  return jsonOk(toClaimDetail(data as Record<string, unknown>), 201);
}
