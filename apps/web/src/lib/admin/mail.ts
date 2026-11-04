import { SUPPORT_EMAIL } from "@claimsaver/shared";

function fromAddress() {
  const email = process.env.RESEND_FROM_EMAIL?.trim() || "noreply@claimsaverplus.com";
  return `ClaimSaver+ <${email}>`;
}

function origin() {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "";
  if (configured && !configured.includes("localhost")) {
    return configured.replace(/\/$/, "");
  }
  return "https://www.claimsaverplus.com";
}

export function siteOrigin() {
  return origin();
}

export async function sendOperationalEmail(input: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<{ id: string; status: "sent" | "skipped" | "failed"; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { id: "", status: "skipped" };
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(key);
    const { data, error } = await resend.emails.send({
      from: fromAddress(),
      to: input.to,
      replyTo: SUPPORT_EMAIL,
      subject: input.subject,
      text: input.text,
      html: input.html ?? `<pre style="font-family:inherit;white-space:pre-wrap">${escapeHtml(input.text)}</pre>`,
    });
    if (error) return { id: "", status: "failed", error: error.message };
    return { id: data?.id ?? "", status: "sent" };
  } catch (err) {
    return {
      id: "",
      status: "failed",
      error: err instanceof Error ? err.message : "send failed",
    };
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
