import { NextRequest } from "next/server";
import { CUSTOMER_CLAIM_STATUSES, normalizeAccidentDate, patchClaimSchema } from "@claimsaver/shared";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { jsonErr, jsonOk, requirePlatformAccess } from "@/lib/supabase/auth";
import { stripClaimantSsn, toClaimDetail } from "@/lib/api/mappers";
import { syncPipDeadlineChain } from "@/lib/api/milestones";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const { user, response } = await requirePlatformAccess(req);
  if (response) return response;
  const { id } = await ctx.params;
  if (!isSupabaseConfigured()) return jsonErr("Database not configured", 503);

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("claims")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) return jsonErr(error.message, 500);
  if (!data) return jsonErr("Not found", 404);
  return jsonOk(toClaimDetail(data as Record<string, unknown>));
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { user, response } = await requirePlatformAccess(req);
  if (response) return response;
  const { id } = await ctx.params;
  if (!isSupabaseConfigured()) return jsonErr("Database not configured", 503);

  const parsed = patchClaimSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return jsonErr("Invalid claim update");

  const admin = getSupabaseAdmin();
  const { data: existing, error: findErr } = await admin
    .from("claims")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (findErr) return jsonErr(findErr.message, 500);
  if (!existing) return jsonErr("Not found", 404);

  const prev = (existing.worksheet ?? {}) as Record<string, unknown>;
  const nextWorksheet = stripClaimantSsn(
    parsed.data.worksheet ? { ...prev, ...parsed.data.worksheet } : prev,
  );
  const accidentDate = normalizeAccidentDate({
    dateOfAccident: String(nextWorksheet.dateOfAccident || ""),
    accidentDate: String(nextWorksheet.accidentDate || ""),
    accidentDateTime: String(nextWorksheet.accidentDateTime || ""),
  });
  if (accidentDate) {
    nextWorksheet.dateOfAccident = accidentDate;
    nextWorksheet.accidentDate = accidentDate;
  }

  const nextStatus = parsed.data.status && CUSTOMER_CLAIM_STATUSES.includes(parsed.data.status)
    ? parsed.data.status
    : existing.status;

  const { data, error } = await admin
    .from("claims")
    .update({
      worksheet: nextWorksheet,
      status: nextStatus,
      priority: parsed.data.priority ?? existing.priority,
      worksheet_step: parsed.data.worksheetStep ?? existing.worksheet_step,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error || !data) return jsonErr(error?.message || "Could not update", 500);

  await syncPipDeadlineChain(admin, user.id, id, accidentDate);

  return jsonOk(toClaimDetail(data as Record<string, unknown>));
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { user, response } = await requirePlatformAccess(req);
  if (response) return response;
  const { id } = await ctx.params;
  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("claims")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return jsonErr(error.message, 500);
  return jsonOk({ ok: true });
}
