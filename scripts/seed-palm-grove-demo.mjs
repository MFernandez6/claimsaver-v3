/**
 * Fill the Palm Grove (West Palm Beach) mock clinic so /clinic looks live.
 * Progress only — empty worksheets, no documents, patients cannot sign in.
 *
 *   node scripts/seed-palm-grove-demo.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { randomBytes, randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const CLINIC_ID = "06ecfbc5-98a0-487e-90c8-7f4d6a54d270";

function loadEnv(file) {
  if (!existsSync(file)) return;
  for (const raw of readFileSync(file, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv(join(root, "apps/web/.env.local"));
loadEnv(join(root, ".env.local"));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function daysAgo(n) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
}

function claimNumber() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `CS${y}${m}-${randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

const PATIENTS = [
  { email: "demo.pg.ana.morales@claimsaverplus.com", first: "Ana", last: "Morales", step: 10, status: "submitted", ago: 2, enrolledAgo: 18 },
  { email: "demo.pg.luis.ortega@claimsaverplus.com", first: "Luis", last: "Ortega", step: 4, status: "in_progress", ago: 1, enrolledAgo: 8 },
  { email: "demo.pg.priya.shah@claimsaverplus.com", first: "Priya", last: "Shah", step: 2, status: "draft", ago: 21, enrolledAgo: 26 },
  { email: "demo.pg.jordan.hale@claimsaverplus.com", first: "Jordan", last: "Hale", step: 0, status: "none", ago: null, enrolledAgo: 5 },
  { email: "demo.pg.camila.reyes@claimsaverplus.com", first: "Camila", last: "Reyes", step: 8, status: "in_progress", ago: 0, enrolledAgo: 12 },
  { email: "demo.pg.marcus.chen@claimsaverplus.com", first: "Marcus", last: "Chen", step: 10, status: "in_progress", ago: 3, enrolledAgo: 20 },
];

async function findUser(email) {
  for (let page = 1; page <= 8; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const found = data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    if (found) return found;
    if (data.users.length < 200) return null;
  }
  return null;
}

async function waitForProfile(userId) {
  for (let i = 0; i < 12; i += 1) {
    const { data } = await admin.from("profiles").select("id").eq("id", userId).maybeSingle();
    if (data) return;
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  const { error } = await admin.from("profiles").upsert({
    id: userId,
    email: "",
    first_name: "",
    last_name: "",
    has_platform_access: false,
  });
  if (error) throw new Error(`Profile missing for ${userId}: ${error.message}`);
}

async function ensureDemoUser(patient) {
  const existing = await findUser(patient.email);
  const password = randomBytes(24).toString("base64url");
  let userId = existing?.id;
  if (!userId) {
    const created = await admin.auth.admin.createUser({
      email: patient.email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: patient.first,
        last_name: patient.last,
        demo_clinic: "palm-grove",
      },
    });
    if (created.error || !created.data.user) {
      throw new Error(created.error?.message ?? `Could not create ${patient.email}`);
    }
    userId = created.data.user.id;
  }
  await waitForProfile(userId);
  await admin
    .from("profiles")
    .update({
      first_name: patient.first,
      last_name: patient.last,
      email: patient.email,
      has_platform_access: false,
      is_active: true,
    })
    .eq("id", userId);
  return userId;
}

async function seedClaim(userId, patient) {
  await admin.from("claims").delete().eq("user_id", userId);
  if (!patient.step) return;
  const updatedAt = daysAgo(patient.ago ?? 0);
  const { error } = await admin.from("claims").insert({
    user_id: userId,
    claim_number: claimNumber(),
    status: patient.status === "none" ? "draft" : patient.status,
    priority: "medium",
    worksheet_step: patient.step,
    worksheet: {},
    created_at: daysAgo(patient.enrolledAgo),
    updated_at: updatedAt,
  });
  if (error) throw error;
}

async function main() {
  const { error: clinicErr } = await admin
    .from("clinics")
    .update({
      dba: "Palm Grove Rehab",
      address: "412 Clematis Street, Suite 210, West Palm Beach, FL 33401",
      ahca_license: "MMC1234567",
      notes: "MOCK PILOT — West Palm Beach clinic for canvassing demos. Patient rows are fictional progress only.",
      plan: "PILOT",
      pilot_start: "2026-11-01",
      baa_status: "SIGNED",
      baa_signed_at: "2026-11-04",
      is_active: true,
    })
    .eq("id", CLINIC_ID);
  if (clinicErr) throw clinicErr;

  for (const patient of PATIENTS) {
    const userId = await ensureDemoUser(patient);
    await seedClaim(userId, patient);
    const { error } = await admin.from("clinic_enrollments").upsert(
      {
        clinic_id: CLINIC_ID,
        user_id: userId,
        display_name: `${patient.first} ${patient.last}`,
        enrolled_at: daysAgo(patient.enrolledAgo),
      },
      { onConflict: "clinic_id,user_id" },
    );
    if (error) throw error;
    console.log("enrolled", patient.first, patient.last, "step", patient.step);
  }

  const test1 = await findUser("test1@claimsaverplus.com");
  if (test1) {
    const { data: profile } = await admin
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", test1.id)
      .maybeSingle();
    const displayName = `${profile?.first_name ?? "Alex"} ${profile?.last_name ?? "Rivera"}`.trim();
    const { error } = await admin.from("clinic_enrollments").upsert(
      {
        clinic_id: CLINIC_ID,
        user_id: test1.id,
        display_name: displayName,
        enrolled_at: daysAgo(4),
      },
      { onConflict: "clinic_id,user_id" },
    );
    if (error) throw error;
    console.log("enrolled test1", displayName);
  }

  console.log("Palm Grove mock roster ready.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
