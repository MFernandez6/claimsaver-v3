import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SUPPORT_EMAIL } from "@claimsaver/shared";
import { daysCopy, type DaysLocale } from "@/content/14days";

const PRODUCTION_SITE_URL = "https://www.claimsaverplus.com";

function emailOrigin() {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "";
  if (configured && !configured.includes("localhost")) {
    return configured.replace(/\/$/, "");
  }
  return PRODUCTION_SITE_URL;
}

async function loadChecklistPdf(locale: DaysLocale) {
  const copy = daysCopy[locale];
  const relative = copy.pdfPath.replace(/^\//, "");
  const filename = relative.split("/").pop() || "14-day-pip-checklist.pdf";
  const candidates = [
    join(process.cwd(), "public", relative),
    join(process.cwd(), "apps/web/public", relative),
  ];
  for (const file of candidates) {
    try {
      return { filename, content: await readFile(file) };
    } catch {
      continue;
    }
  }

  const res = await fetch(`${emailOrigin()}/${relative}`);
  if (!res.ok) {
    throw new Error("Checklist PDF is missing");
  }
  return { filename, content: Buffer.from(await res.arrayBuffer()) };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function fromAddress() {
  const email = process.env.RESEND_FROM_EMAIL?.trim() || "noreply@claimsaverplus.com";
  return `ClaimSaver+ <${email}>`;
}

export function checklistEmail(locale: DaysLocale) {
  const copy = daysCopy[locale];
  const origin = emailOrigin();
  const url = `${origin}${copy.pdfPath}`;
  const html = `<!doctype html>
<html lang="${copy.htmlLang}">
<body style="margin:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:28px 12px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
        <tr><td style="background:#ecfdf5;border-bottom:2px solid #0d9488;padding:18px 28px;font-size:13px;letter-spacing:0.16em;text-transform:uppercase;color:#0f766e;font-weight:700;">ClaimSaver+</td></tr>
        <tr><td style="padding:28px 28px 8px;font-size:36px;font-weight:800;letter-spacing:-0.04em;color:#0f172a;">${escapeHtml(copy.heroTitle)}</td></tr>
        <tr><td style="padding:0 28px 12px;font-size:20px;font-weight:700;color:#0f172a;">${escapeHtml(copy.emailHeading)}</td></tr>
        <tr><td style="padding:0 28px 24px;font-size:16px;line-height:1.55;color:#334155;">${escapeHtml(copy.emailBody)}</td></tr>
        <tr><td style="padding:0 28px 28px;">
          <a href="${url}" style="display:inline-block;background:#0d9488;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:10px;">${escapeHtml(copy.emailCta)}</a>
        </td></tr>
        <tr><td style="padding:16px 28px 24px;font-size:12px;line-height:1.5;color:#64748b;border-top:1px solid #e2e8f0;">${escapeHtml(copy.emailFoot)}</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
  const text = `${copy.emailHeading}\n\n${copy.emailBody}\n\n${url}\n\n${copy.emailFoot}`;
  return {
    from: fromAddress(),
    replyTo: SUPPORT_EMAIL,
    subject: copy.emailSubject,
    html,
    text,
    downloadUrl: url,
  };
}

export async function sendChecklistEmail(to: string, locale: DaysLocale) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY is not set");
  }
  const { Resend } = await import("resend");
  const resend = new Resend(key);
  const message = checklistEmail(locale);
  const attachment = await loadChecklistPdf(locale);
  const { data, error } = await resend.emails.send({
    from: message.from,
    to,
    replyTo: message.replyTo,
    subject: message.subject,
    html: message.html,
    text: message.text,
    attachments: [
      {
        filename: attachment.filename,
        content: attachment.content,
      },
    ],
  });
  if (error) {
    throw new Error(error.message || "Checklist email failed");
  }
  return { sent: true as const, id: data?.id ?? null };
}
