import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { jsonErr, jsonOk, requireAdmin } from "@/lib/supabase/auth";
import { stripClaimantSsn } from "@/lib/api/mappers";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const { response } = await requireAdmin(req);
  if (response) return response;
  const { id } = await ctx.params;
  const admin = getSupabaseAdmin();
  const { data: claim, error } = await admin.from("claims").select("*").eq("id", id).maybeSingle();
  if (error) return jsonErr(error.message, 500);
  if (!claim) return jsonErr("Not found", 404);
  const worksheet = stripClaimantSsn((claim.worksheet ?? {}) as Record<string, unknown>);
  const [{ data: docs }, { data: notes }, { data: profile }] = await Promise.all([
    admin.from("claim_documents").select("id,name,type,created_at").eq("claim_id", id),
    admin.from("admin_notes").select("*").eq("claim_id", id).order("created_at", { ascending: false }),
    admin.from("profiles").select("id,email,first_name,last_name").eq("id", claim.user_id).maybeSingle(),
  ]);
  return jsonOk({
    claim: { ...claim, worksheet },
    documents: docs ?? [],
    notes: notes ?? [],
    submitter: profile,
  });
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const { user, response } = await requireAdmin(req);
  if (response) return response;
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as { body?: string };
  if (!body.body?.trim()) return jsonErr("Note required");
  const { data, error } = await getSupabaseAdmin()
    .from("admin_notes")
    .insert({ claim_id: id, author_id: user.id, body: body.body.trim() })
    .select("*")
    .single();
  if (error) return jsonErr(error.message, 500);
  return jsonOk(data, 201);
}
