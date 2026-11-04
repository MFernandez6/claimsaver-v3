import { NextRequest } from "next/server";
import { SUPPORT_EMAIL } from "@claimsaver/shared";
import { jsonErr, jsonOk } from "@/lib/supabase/auth";
import { sendOperationalEmail } from "@/lib/admin/mail";
import { rateLimit, rateLimitResponse, clientIp } from "@/lib/security/rate-limit";

function clip(value: unknown, max = 200) {
  const next = String(value ?? "").trim();
  if (!next) return "";
  return next.slice(0, max);
}

export async function POST(req: NextRequest) {
  const limited = await rateLimit(`clinic-demo:${clientIp(req)}`, 20, 60 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const source = clip(body.source, 80) || "clinic-demo";
  const clinicName = clip(body.clinicName);
  const contactName = clip(body.contactName);
  const email = clip(body.email, 254);
  const phone = clip(body.phone, 40);
  const preferredTime = clip(body.preferredTime, 300);

  if (!clinicName || !email) {
    return jsonOk({ ok: true, logged: true });
  }

  const sent = await sendOperationalEmail({
    to: SUPPORT_EMAIL,
    subject: `Clinic demo request: ${clinicName}`,
    text: [
      `Source: ${source}`,
      `Clinic: ${clinicName}`,
      `Contact: ${contactName || "—"}`,
      `Email: ${email}`,
      `Phone: ${phone || "—"}`,
      `Preferred time: ${preferredTime || "—"}`,
    ].join("\n"),
  });

  if (sent.status === "failed") return jsonErr(sent.error || "Could not send the request.", 500);
  return jsonOk({ ok: true, emailed: sent.status === "sent" });
}
