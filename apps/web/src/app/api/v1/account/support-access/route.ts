import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { jsonErr, jsonOk, requireUser } from "@/lib/supabase/auth";
import { writeAudit } from "@/lib/admin/audit";
import { requestIp, requestUserAgent } from "@/lib/admin/request-meta";
import { IMPERSONATION_MS } from "@/lib/admin/impersonation";
import { isUuid } from "@/lib/admin/user-query";

export async function GET(req: NextRequest) {
  const { user, response } = await requireUser(req);
  if (response) return response;

  const admin = getSupabaseAdmin();
  const [{ data: pending }, { data: activity }] = await Promise.all([
    admin
      .from("impersonation_sessions")
      .select("id, reason, requested_at, ticket_id")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .order("requested_at", { ascending: false })
      .limit(5),
    admin
      .from("account_activity")
      .select("id, kind, body, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return jsonOk({ pending: pending ?? [], activity: activity ?? [] });
}

export async function POST(req: NextRequest) {
  const { user, response } = await requireUser(req);
  if (response) return response;

  const body = (await req.json().catch(() => null)) as {
    sessionId?: unknown;
    decision?: unknown;
  } | null;
  const sessionId = typeof body?.sessionId === "string" ? body.sessionId : "";
  const decision = body?.decision === "deny" ? "deny" : "approve";
  if (!isUuid(sessionId)) return jsonErr("Invalid session", 400);

  const admin = getSupabaseAdmin();
  const { data: session } = await admin
    .from("impersonation_sessions")
    .select("id, user_id, staff_id, status")
    .eq("id", sessionId)
    .maybeSingle();
  if (!session || session.user_id !== user.id) return jsonErr("Not found", 404);
  if (session.status !== "pending") return jsonErr("This request is no longer pending", 400);

  if (decision === "deny") {
    await admin
      .from("impersonation_sessions")
      .update({ status: "denied", ended_at: new Date().toISOString() })
      .eq("id", sessionId);
    await writeAudit({
      actorId: user.id,
      actorRole: "CLAIMANT",
      action: "impersonation.denied",
      resourceType: "user",
      resourceId: user.id,
      metadata: { sessionId },
      ip: requestIp(req),
      userAgent: requestUserAgent(req),
    });
    return jsonOk({ ok: true, status: "denied" });
  }

  const expiresAt = new Date(Date.now() + IMPERSONATION_MS).toISOString();
  await admin
    .from("impersonation_sessions")
    .update({
      status: "active",
      approved_at: new Date().toISOString(),
      expires_at: expiresAt,
    })
    .eq("id", sessionId);

  await admin.from("account_activity").insert({
    user_id: user.id,
    kind: "support_view",
    body: `Support viewed your account (approved ${new Date().toLocaleDateString()}).`,
  });

  await writeAudit({
    actorId: user.id,
    actorRole: "CLAIMANT",
    action: "impersonation.approved",
    resourceType: "user",
    resourceId: user.id,
    metadata: { sessionId },
    ip: requestIp(req),
    userAgent: requestUserAgent(req),
  });

  return jsonOk({ ok: true, status: "active", expiresAt });
}
