import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/outreach/guard";
import { parseOutreachBody, resolveOutreachStage } from "@/lib/outreach/records";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const headers = {
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff",
};

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers });
}

function sameOriginWrite(request: NextRequest) {
  const origin = request.headers.get("origin");
  return origin === request.nextUrl.origin && request.headers.get("x-outreach-request") === "1";
}

function missingPipelineColumns(message: string) {
  return /does not exist|schema cache|PGRST204|Could not find the .* column/i.test(message);
}

type OutreachRow = {
  id: string;
  kind: string;
  data: unknown;
  updated: string;
  stage?: unknown;
  next_action_at?: unknown;
  consent_at?: unknown;
  consent_source?: unknown;
};

export async function GET() {
  const staff = await requireStaff();
  if (staff.response) return staff.response;
  const admin = getSupabaseAdmin();
  const full = await admin
    .from("outreach_records")
    .select("id, kind, data, updated, stage, next_action_at, consent_at, consent_source")
    .order("updated", { ascending: false });
  const fallback =
    full.error && missingPipelineColumns(full.error.message)
      ? await admin.from("outreach_records").select("id, kind, data, updated").order("updated", { ascending: false })
      : null;
  const data = (fallback?.data ?? full.data) as OutreachRow[] | null;
  const error = fallback ? fallback.error : full.error;
  if (error) {
    console.error("Outreach storage error:", error.message);
    const missing = /outreach_records|schema cache|PGRST205/i.test(error.message);
    return json({
      error: missing
        ? "Outreach storage is not set up yet. The starter clinics are still listed. Saves will work after the database update."
        : "Workspace storage is temporarily unavailable. The starter clinics are still listed.",
    }, 503);
  }
  return json(
    (data ?? []).map((row) => {
      const payload = row.data && typeof row.data === "object" ? (row.data as Record<string, unknown>) : {};
      const stage = resolveOutreachStage({
        kind: String(row.kind),
        stage: row.stage ?? payload.stage,
        status: typeof payload.status === "string" ? payload.status : undefined,
      });
      return {
        ...payload,
        id: row.id,
        kind: row.kind,
        updated: row.updated,
        stage: stage ?? "",
        nextActionAt: row.next_action_at ?? payload.nextActionAt ?? "",
        consentAt: row.consent_at ?? payload.consentAt ?? "",
        consentSource: row.consent_source ?? payload.consentSource ?? "",
      };
    }),
  );
}

export async function PUT(request: NextRequest) {
  return write(request, "PUT");
}

export async function DELETE(request: NextRequest) {
  return write(request, "DELETE");
}

async function write(request: NextRequest, method: "PUT" | "DELETE") {
  const staff = await requireStaff();
  if (staff.response) return staff.response;
  if (!sameOriginWrite(request)) {
    return json({ error: "Please use the outreach workspace to make changes." }, 403);
  }
  const raw = await request.text();
  const parsed = parseOutreachBody(raw, method);
  if (!parsed.ok) return json({ error: parsed.error }, parsed.status);
  const admin = getSupabaseAdmin();
  if (method === "DELETE") {
    const { error } = await admin.from("outreach_records").delete().eq("id", parsed.id);
    if (error) {
      console.error("Outreach storage error:", error.message);
      return json({ error: "Workspace storage is temporarily unavailable. Try again." }, 503);
    }
    return json({ ok: true });
  }
  const write = parsed.write;
  if (!write) return json({ error: "Invalid record." }, 400);
  const updated = new Date().toISOString();
  let { error } = await admin.from("outreach_records").upsert({
    id: write.id,
    kind: write.kind,
    data: write.fields,
    stage: write.stage,
    next_action_at: write.nextActionAt,
    consent_at: write.consentAt,
    consent_source: write.consentSource,
    updated,
  });
  if (error && missingPipelineColumns(error.message)) {
    ({ error } = await admin.from("outreach_records").upsert({
      id: write.id,
      kind: write.kind,
      data: {
        ...write.fields,
        ...(write.stage ? { stage: write.stage } : {}),
        ...(write.nextActionAt ? { nextActionAt: write.nextActionAt } : {}),
        ...(write.consentAt ? { consentAt: write.consentAt } : {}),
        ...(write.consentSource ? { consentSource: write.consentSource } : {}),
      },
      updated,
    }));
  }
  if (error) {
    console.error("Outreach storage error:", error.message);
    return json({ error: "Workspace storage is temporarily unavailable. Try again." }, 503);
  }
  return json({ ok: true });
}
