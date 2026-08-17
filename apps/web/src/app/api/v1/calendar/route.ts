import { NextRequest } from "next/server";
import { createCalendarEventSchema } from "@claimsaver/shared";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { jsonErr, jsonOk, requirePlatformAccess } from "@/lib/supabase/auth";

function toEvent(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    claimId: row.claim_id ? String(row.claim_id) : null,
    title: String(row.title),
    date: String(row.date),
    time: String(row.time ?? ""),
    type: String(row.type),
    description: String(row.description ?? ""),
    priority: String(row.priority),
    completed: Boolean(row.completed),
    createdAt: String(row.created_at),
  };
}

export async function GET(req: NextRequest) {
  const { user, response } = await requirePlatformAccess(req);
  if (response) return response;
  if (!isSupabaseConfigured()) return jsonErr("Database not configured", 503);
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("calendar_events")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: true });
  if (error) return jsonErr(error.message, 500);
  return jsonOk((data ?? []).map((r) => toEvent(r as Record<string, unknown>)));
}

export async function POST(req: NextRequest) {
  const { user, response } = await requirePlatformAccess(req);
  if (response) return response;
  const parsed = createCalendarEventSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return jsonErr("Invalid event");
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("calendar_events")
    .insert({
      user_id: user.id,
      claim_id: parsed.data.claimId ?? null,
      title: parsed.data.title,
      date: parsed.data.date,
      time: parsed.data.time,
      type: parsed.data.type,
      description: parsed.data.description,
      priority: parsed.data.priority,
    })
    .select("*")
    .single();
  if (error || !data) return jsonErr(error?.message || "Could not create event", 500);
  return jsonOk(toEvent(data as Record<string, unknown>), 201);
}
