#!/usr/bin/env node
/**
 * Push ClaimSaver+ Auth email templates to the hosted Supabase project.
 *
 * New Free-plan projects (this v3 project was created after 3 June 2026) cannot
 * customize templates on Supabase's default SMTP. Configure custom SMTP first:
 *
 *   SMTP_HOST=smtp.resend.com SMTP_PORT=465 SMTP_USER=resend SMTP_PASS=re_xxx \
 *   SMTP_ADMIN_EMAIL=noreply@claimsaverplus.com SMTP_SENDER_NAME=ClaimSaver+ \
 *   node supabase/templates/push.mjs
 *
 * Token: SUPABASE_ACCESS_TOKEN, or the macOS Keychain item used by `supabase login`.
 */
import { execFileSync } from "node:child_process";
import { hostedApiMap, SENDER_NAME, templates } from "./emails.mjs";

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || "xskwxedxltqxajviusto";
const API = `https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`;

function accessToken() {
  if (process.env.SUPABASE_ACCESS_TOKEN) return process.env.SUPABASE_ACCESS_TOKEN.trim();
  try {
    return execFileSync("security", ["find-generic-password", "-s", "Supabase CLI", "-w"], {
      encoding: "utf8",
    }).trim();
  } catch {
    throw new Error("Set SUPABASE_ACCESS_TOKEN or run `npx supabase login`.");
  }
}

async function request(method, body) {
  const res = await fetch(API, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    const msg = json.message || json.error || text || res.statusText;
    const err = new Error(`${method} ${res.status}: ${msg}`);
    err.status = res.status;
    err.body = json;
    throw err;
  }
  return json;
}

function smtpPayload() {
  const host = process.env.SMTP_HOST;
  const pass = process.env.SMTP_PASS;
  const admin = process.env.SMTP_ADMIN_EMAIL;
  if (!host || !pass || !admin) return null;
  return {
    external_email_enabled: true,
    smtp_host: host,
    smtp_port: String(process.env.SMTP_PORT || "465"),
    smtp_user: process.env.SMTP_USER || "resend",
    smtp_pass: pass,
    smtp_admin_email: admin,
    smtp_sender_name: process.env.SMTP_SENDER_NAME || SENDER_NAME,
  };
}

function templatePayload() {
  const body = {};
  for (const [name, keys] of Object.entries(hostedApiMap)) {
    const tmpl = templates[name];
    body[keys.subjectKey] = tmpl.subject;
    body[keys.contentKey] = tmpl.html;
  }
  return body;
}

try {
  const smtp = smtpPayload();
  if (smtp) {
    console.log("Configuring custom SMTP…");
    await request("PATCH", smtp);
    console.log("SMTP saved. Raising hourly email rate limit to 100.");
    await request("PATCH", { rate_limit_email_sent: 100 });
  }

  console.log("Pushing ClaimSaver+ email templates…");
  await request("PATCH", templatePayload());
  const cfg = await request("GET");
  console.log("Subjects now:");
  for (const keys of Object.values(hostedApiMap)) {
    console.log(`  ${cfg[keys.subjectKey]}`);
  }
  console.log("From:", cfg.smtp_sender_name || "(default SMTP — sender will still say Supabase)");
} catch (err) {
  const locked =
    String(err.message || "").includes("not available for free tier") ||
    String(err.body?.message || "").includes("not available for free tier");
  if (locked) {
    console.error(`
Hosted templates are locked until custom SMTP is enabled.

This project (claimsaver-v3) is on the Free plan with Supabase's default mailer.
From 3 June 2026, new Free projects cannot change Auth email templates until you
add your own SMTP provider (Resend, Postmark, SendGrid, SES, …).

Fastest path:
  1. Create a Resend account and verify claimsaverplus.com (SPF + DKIM).
  2. Create an API key and a sending address such as noreply@claimsaverplus.com.
  3. Re-run:

     SMTP_HOST=smtp.resend.com SMTP_PORT=465 SMTP_USER=resend SMTP_PASS=re_xxx \\
     SMTP_ADMIN_EMAIL=noreply@claimsaverplus.com SMTP_SENDER_NAME=ClaimSaver+ \\
     node supabase/templates/push.mjs
`);
    process.exit(1);
  }
  console.error(err.message);
  process.exit(1);
}
