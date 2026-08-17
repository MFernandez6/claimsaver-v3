import { NextRequest } from "next/server";
import { normalizeAccidentDate } from "@claimsaver/shared";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { jsonErr, jsonOk, requirePlatformAccess } from "@/lib/supabase/auth";
import { syncPipDeadlineChain } from "@/lib/api/milestones";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  const { user, response } = await requirePlatformAccess(req);
  if (response) return response;
  const { id } = await ctx.params;
  if (!isSupabaseConfigured()) return jsonErr("Database not configured", 503);

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("claims")
    .select("id, worksheet")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) return jsonErr(error.message, 500);
  if (!data) return jsonErr("Not found", 404);

  const ws = (data.worksheet ?? {}) as Record<string, unknown>;
  const accidentDate = normalizeAccidentDate({
    dateOfAccident: String(ws.dateOfAccident || ""),
    accidentDate: String(ws.accidentDate || ""),
    accidentDateTime: String(ws.accidentDateTime || ""),
  });
  if (!accidentDate) return jsonErr("Add an accident date on the worksheet first");

  await syncPipDeadlineChain(admin, user.id, id, accidentDate);
  return jsonOk({ ok: true, accidentDate });
}
