import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { jsonErr, jsonOk } from "@/lib/supabase/auth";
import { requirePermission } from "@/lib/admin/require-permission";
import { writeAudit } from "@/lib/admin/audit";
import { requestIp, requestUserAgent } from "@/lib/admin/request-meta";
import { isUuid } from "@/lib/admin/user-query";
import { sendOperationalEmail, siteOrigin } from "@/lib/admin/mail";
import { ADMIN } from "@/content/admin";
import { rateLimit, rateLimitResponse, clientIp } from "@/lib/security/rate-limit";

export async function POST(req: NextRequest) {
  const limited = await rateLimit(`admin-impersonate:${clientIp(req)}`, 10, 10 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);

  const { user, role, response } = await requirePermission(req, "impersonate.breakglass", {
    audit: false,
  });
  if (response) return response;

  const body = (await req.json().catch(() => null)) as {
    userId?: unknown;
    ticketId?: unknown;
    reason?: unknown;
  } | null;
  const userId = typeof body?.userId === "string" ? body.userId : "";
  const ticketId = typeof body?.ticketId === "string" ? body.ticketId : "";
  const reason = typeof body?.reason === "string" ? body.reason.trim() : "";
  if (!isUuid(userId) || !isUuid(ticketId) || reason.length < 3) {
    return jsonErr("A support ticket and a reason are required", 400);
  }

  const admin = getSupabaseAdmin();
  const { data: ticket } = await admin
    .from("support_tickets")
    .select("id, subject, user_id")
    .eq("id", ticketId)
    .maybeSingle();
  if (!ticket || ticket.user_id !== userId) {
    return jsonErr("Ticket must belong to this account", 400);
  }

  const { data: session, error } = await admin
    .from("impersonation_sessions")
    .insert({
      staff_id: user.id,
      user_id: userId,
      ticket_id: ticketId,
      reason,
      status: "pending",
    })
    .select("id")
    .single();
  if (error || !session) return jsonErr(error?.message ?? "Could not request session", 500);

  const { data: profile } = await admin
    .from("profiles")
    .select("email")
    .eq("id", userId)
    .maybeSingle();
  if (profile?.email) {
    await sendOperationalEmail({
      to: String(profile.email),
      subject: "ClaimSaver+ Support asked to view your account",
      text: `${ADMIN.impersonationEmail}\n\nTicket: ${ticket.subject}\nApprove or deny: ${siteOrigin()}/dashboard`,
    });
  }

  await writeAudit({
    actorId: user.id,
    actorRole: role,
    action: "impersonation.request",
    resourceType: "user",
    resourceId: userId,
    metadata: { ticketId, sessionId: session.id },
    ip: requestIp(req),
    userAgent: requestUserAgent(req),
  });

  return jsonOk({ sessionId: session.id, status: "pending" }, 201);
}
