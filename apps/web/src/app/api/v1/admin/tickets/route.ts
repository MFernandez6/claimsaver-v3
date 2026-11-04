import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { jsonErr, jsonOk } from "@/lib/supabase/auth";
import { requirePermission } from "@/lib/admin/require-permission";
import { writeAudit } from "@/lib/admin/audit";
import { requestIp, requestUserAgent } from "@/lib/admin/request-meta";
import { escapeIlikeExact, parseUserQuery } from "@/lib/admin/user-query";
import { maskEmail } from "@/lib/auth/mask";
import { rateLimit, rateLimitResponse, clientIp } from "@/lib/security/rate-limit";

const STATUSES = new Set(["open", "waiting", "closed"]);

type TicketRow = {
  id: string;
  user_id: string;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
};

export async function GET(req: NextRequest) {
  const limited = await rateLimit(`admin-tickets:${clientIp(req)}`, 40, 10 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);

  const { response } = await requirePermission(req, "support.tickets", {
    resourceType: "ticket",
    resourceId: "list",
  });
  if (response) return response;

  const status = new URL(req.url).searchParams.get("status") ?? "";
  let query = getSupabaseAdmin()
    .from("support_tickets")
    .select("id, user_id, subject, status, priority, created_at, updated_at")
    .order("updated_at", { ascending: false })
    .limit(100);
  if (STATUSES.has(status)) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return jsonErr(error.message, 500);

  const tickets = (data ?? []) as TicketRow[];
  const userIds = [...new Set(tickets.map((row) => row.user_id))];
  const emails = new Map<string, string>();
  if (userIds.length) {
    const { data: profiles } = await getSupabaseAdmin()
      .from("profiles")
      .select("id, email")
      .in("id", userIds);
    for (const row of profiles ?? []) {
      emails.set(row.id as string, maskEmail(String(row.email ?? "")));
    }
  }

  return jsonOk({
    tickets: tickets.map((row) => ({
      id: row.id,
      userId: row.user_id,
      email: emails.get(row.user_id) ?? "***",
      subject: row.subject,
      status: row.status,
      priority: row.priority,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })),
  });
}

export async function POST(req: NextRequest) {
  const limited = await rateLimit(`admin-ticket-create:${clientIp(req)}`, 20, 10 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);

  const { user, role, response } = await requirePermission(req, "support.tickets", {
    audit: false,
  });
  if (response) return response;

  const body = (await req.json().catch(() => null)) as {
    userId?: unknown;
    email?: unknown;
    subject?: unknown;
    priority?: unknown;
    note?: unknown;
  } | null;

  const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
  if (subject.length < 1 || subject.length > 200) {
    return jsonErr("Subject is required (1–200 characters)", 400);
  }
  const priority = body?.priority === "high" ? "high" : "normal";
  const note = typeof body?.note === "string" ? body.note.trim() : "";

  let userId = typeof body?.userId === "string" ? body.userId.trim() : "";
  if (!userId && typeof body?.email === "string") {
    const parsed = parseUserQuery(body.email);
    if (!parsed.ok || parsed.kind !== "email") {
      return jsonErr("Open a ticket with an exact account email or user ID", 400);
    }
    const { data, error } = await getSupabaseAdmin()
      .from("profiles")
      .select("id")
      .ilike("email", escapeIlikeExact(parsed.value))
      .maybeSingle();
    if (error) return jsonErr(error.message, 500);
    if (!data) return jsonErr("No account matches that email", 404);
    userId = data.id as string;
  }
  if (!userId) return jsonErr("userId or email is required", 400);

  const admin = getSupabaseAdmin();
  const { data: ticket, error } = await admin
    .from("support_tickets")
    .insert({
      user_id: userId,
      subject,
      priority,
      created_by: user.id,
    })
    .select("id, user_id, subject, status, priority, created_at")
    .single();
  if (error || !ticket) return jsonErr(error?.message ?? "Could not open ticket", 500);

  if (note) {
    await admin.from("support_messages").insert({
      ticket_id: ticket.id,
      author_id: user.id,
      author_kind: "staff",
      body: note,
    });
  }

  await writeAudit({
    actorId: user.id,
    actorRole: role,
    action: "support.ticket.create",
    resourceType: "ticket",
    resourceId: ticket.id as string,
    metadata: { userId, priority },
    ip: requestIp(req),
    userAgent: requestUserAgent(req),
  });

  return jsonOk({ ticket }, 201);
}
