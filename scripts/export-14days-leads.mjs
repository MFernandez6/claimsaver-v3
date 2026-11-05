#!/usr/bin/env node
/**
 * Export leads_14days to CSV on stdout.
 * Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 *
 *   node --env-file=apps/web/.env.local scripts/export-14days-leads.mjs > leads.csv
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const COLS = [
  "id",
  "created_at",
  "first_name",
  "email",
  "phone",
  "locale",
  "ack_self_help",
  "sms_consent",
  "sms_consent_at",
  "sms_consent_text",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
  "referrer",
  "landing_path",
];

function csvCell(value) {
  if (value == null) return "";
  const s = String(value);
  if (/[",\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
  return s;
}

const supabase = createClient(url, key, { auth: { persistSession: false } });
const { data, error } = await supabase
  .from("leads_14days")
  .select(COLS.join(","))
  .order("created_at", { ascending: false });

if (error) {
  console.error(error.message);
  process.exit(1);
}

console.log(COLS.join(","));
for (const row of data ?? []) {
  console.log(COLS.map((col) => csvCell(row[col])).join(","));
}
