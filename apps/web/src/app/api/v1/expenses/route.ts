import { NextRequest } from "next/server";
import { createExpenseSchema } from "@claimsaver/shared";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { jsonErr, jsonOk, requirePlatformAccess } from "@/lib/supabase/auth";
import { resolveOwnedClaimId } from "@/lib/api/owned-claim";

function toExpense(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    claimId: row.claim_id ? String(row.claim_id) : null,
    category: String(row.category),
    amountCents: Number(row.amount_cents),
    description: String(row.description),
    incurredOn: String(row.incurred_on),
    createdAt: String(row.created_at),
  };
}

export async function GET(req: NextRequest) {
  const { user, response } = await requirePlatformAccess(req);
  if (response) return response;
  if (!isSupabaseConfigured()) return jsonErr("Database not configured", 503);
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("expenses")
    .select("*")
    .eq("user_id", user.id)
    .order("incurred_on", { ascending: false });
  if (error) return jsonErr(error.message, 500);
  return jsonOk((data ?? []).map((r) => toExpense(r as Record<string, unknown>)));
}

export async function POST(req: NextRequest) {
  const { user, response } = await requirePlatformAccess(req);
  if (response) return response;
  const parsed = createExpenseSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return jsonErr("Invalid expense");
  const admin = getSupabaseAdmin();
  const owned = await resolveOwnedClaimId(admin, user.id, parsed.data.claimId);
  if (owned.error) return jsonErr(owned.error, 404);
  const { data, error } = await admin
    .from("expenses")
    .insert({
      user_id: user.id,
      claim_id: owned.claimId,
      category: parsed.data.category,
      amount_cents: parsed.data.amountCents,
      description: parsed.data.description,
      incurred_on: parsed.data.incurredOn,
    })
    .select("*")
    .single();
  if (error || !data) return jsonErr(error?.message || "Could not save expense", 500);
  return jsonOk(toExpense(data as Record<string, unknown>), 201);
}
