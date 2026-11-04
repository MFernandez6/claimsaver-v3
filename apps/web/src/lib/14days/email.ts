import { SUPPORT_EMAIL } from "@claimsaver/shared";
import { daysCopy, type DaysLocale } from "@/content/14days";
import { siteUrl } from "@/lib/utils";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function checklistEmail(locale: DaysLocale) {
  const copy = daysCopy[locale];
  const origin = siteUrl().replace(/\/$/, "");
  const url = `${origin}${copy.pdfPath}`;
  const html = `<!doctype html>
<html lang="${copy.htmlLang}">
<body style="margin:0;background:#0f172a;font-family:Georgia,serif;color:#e2e8f0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;">
        <tr><td style="font-size:13px;letter-spacing:0.2em;text-transform:uppercase;color:#5eead4;padding-bottom:16px;">ClaimSaver+</td></tr>
        <tr><td style="font-size:42px;font-weight:800;color:#2dd4bf;letter-spacing:-0.04em;padding-bottom:8px;">${escapeHtml(copy.heroTitle)}</td></tr>
        <tr><td style="font-size:22px;color:#f8fafc;padding-bottom:16px;">${escapeHtml(copy.emailHeading)}</td></tr>
        <tr><td style="font-size:16px;line-height:1.5;color:#cbd5e1;padding-bottom:24px;">${escapeHtml(copy.emailBody)}</td></tr>
        <tr><td style="padding-bottom:28px;">
          <a href="${url}" style="display:inline-block;background:#0d9488;color:#ecfdf5;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:10px;">${escapeHtml(copy.emailCta)}</a>
        </td></tr>
        <tr><td style="font-size:12px;line-height:1.5;color:#94a3b8;border-top:1px solid #334155;padding-top:16px;">${escapeHtml(copy.emailFoot)}</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
  const text = `${copy.emailHeading}\n\n${copy.emailBody}\n\n${url}\n\n${copy.emailFoot}`;
  return {
    from: `ClaimSaver+ <${SUPPORT_EMAIL}>`,
    subject: copy.emailSubject,
    html,
    text,
    downloadUrl: url,
  };
}

export async function sendChecklistEmail(to: string, locale: DaysLocale) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[14days] RESEND_API_KEY is not set; skipping checklist email");
    return { sent: false as const };
  }
  const { Resend } = await import("resend");
  const resend = new Resend(key);
  const message = checklistEmail(locale);
  const { error } = await resend.emails.send({
    from: message.from,
    to,
    subject: message.subject,
    html: message.html,
    text: message.text,
  });
  if (error) {
    console.error("[14days] checklist email failed", error);
    return { sent: false as const };
  }
  return { sent: true as const };
}
