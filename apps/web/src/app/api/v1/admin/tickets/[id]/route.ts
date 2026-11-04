import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { jsonErr, jsonOk } from "@/lib/supabase/auth";
import { requirePermission } from "@/lib/admin/require-permission";
import { writeAudit } from "@/lib/admin/audit";
import { requestIp, requestUserAgent } from "@/lib/admin/request-meta";
import { isUuid } from "@/lib/admin/user-query";
import { PROFILE_COLUMNS, toStaffUserCard, type ProfileRow } from "@/lib/admin/staff-user";
import { sendOperationalEmail } from "@/lib/admin/mail";
import { ADMIN } from "@/content/admin";
import { rateLimit, rateLimitResponse, clientIp } from "@/lib/security/rate-limit";

type Ctx = { params: Promise<{ id: string }> };

const STATUSES = new Set(["open", "waiting", "closed"]);

export async function GET(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  if (!isUuid(id)) return jsonErr("Invalid ticket id", 400);

  const { response } = await requirePermission(req, "support.tickets", {
    resourceType: "ticket",
    resourceId: id,
  });
  if (response) return response;

  const admin = getSupabaseAdmin();
  const { data: ticket, error } = await admin
    .from("support_tickets")
    .select("id, user_id, subject, status, priority, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();
  if (error) return jsonErr(error.message, 500);
  if (!ticket) return jsonErr("Not found", 404);

  const [{ data: profile }, { data: messages, error: messageError }] = await Promise.all([
    admin.from("profiles").select(PROFILE_COLUMNS).eq("id", ticket.user_id).maybeSingle(),
    admin
      .from("support_messages")
      .select("id, author_id, author_kind, body, created_at")
      .eq("ticket_id", id)
      .order("created_at", { ascending: true })
      .limit(200),
  ]);
  if (messageError) return jsonErr(messageError.message, 500);

  return jsonOk({
    ticket,
    user: profile ? toStaffUserCard(profile as ProfileRow) : null,
    messages: messages ?? [],
  });
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const limited = await rateLimit(`admin-ticket-reply:${clientIp(req)}`, 30, 10 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);

  const { id } = await ctx.params;
  if (!isUuid(id)) return jsonErr("Invalid ticket id", 400);

  const { user, role, response } = await requirePermission(req, "support.tickets", {
    audit: false,
  });
  if (response) return response;

  const body = (await req.json().catch(() => null)) as {
    body?: unknown;
    status?: unknown;
  } | null;

  const admin = getSupabaseAdmin();
  const { data: ticket, error } = await admin
    .from("support_tickets")
    .select("id, status, user_id, subject")
    .eq("id", id)
    .maybeSingle();
  if (error) return jsonErr(error.message, 500);
  if (!ticket) return jsonErr("Not found", 404);

  const message = typeof body?.body === "string" ? body.body.trim() : "";
  const status = typeof body?.status === "string" ? body.status : "";

  if (message) {
    if (message.length > 8000) return jsonErr("Message is too long", 400);
    const { data: profile } = await admin
      .from("profiles")
      .select("email")
      .eq("id", ticket.user_id)
      .maybeSingle();
    const mailed = profile?.email
      ? await sendOperationalEmail({
          to: String(profile.email),
          subject: `ClaimSaver+ support: ${ticket.subject ?? "your account"}`,
          text: `${message}\n\n${ADMIN.ticketEmailFooter}`,
        })
      : { id: "", status: "skipped" as const };
    const { error: insertError } = await admin.from("support_messages").insert({
      ticket_id: id,
      author_id: user.id,
      author_kind: "staff",
      body: message,
      email_id: mailed.id,
      email_status: mailed.status,
    });
    if (insertError) return jsonErr(insertError.message, 500);
  }

  const nextStatus = STATUSES.has(status) ? status : ticket.status;
  const { error: updateError } = await admin
    .from("support_tickets")
    .update({ status: nextStatus, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (updateError) return jsonErr(updateError.message, 500);

  if (!message && nextStatus === ticket.status) {
    return jsonErr("A reply or a status change is required", 400);
  }

  await writeAudit({
    actorId: user.id,
    actorRole: role,
    action: message ? "support.ticket.reply" : "support.ticket.status",
    resourceType: "ticket",
    resourceId: id,
    metadata: { status: nextStatus, hasBody: Boolean(message) },
    ip: requestIp(req),
    userAgent: requestUserAgent(req),
  });

  return jsonOk({ ok: true, status: nextStatus });
}
