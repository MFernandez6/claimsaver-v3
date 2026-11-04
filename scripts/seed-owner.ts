/**
 * One-time OWNER seed.
 *
 *   OWNER_SEED_EMAIL=support@claimsaverplus.com npm run seed:owner
 *
 * Optional: OWNER_SEED_PASSWORD creates the Auth user if missing, or resets
 * the password. Do not commit the password.
 *
 * Never self-promote from the admin UI.
 */
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv(file: string) {
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
const email = (process.env.OWNER_SEED_EMAIL || "support@claimsaverplus.com")
  .trim()
  .toLowerCase();
const password = process.env.OWNER_SEED_PASSWORD || "";

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function findAuthUser() {
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const found = data.users.find((user) => user.email?.toLowerCase() === email);
    if (found) return found;
    if (data.users.length < 200) return null;
  }
  return null;
}

async function main() {
if (password) {
  if (password.length < 12) {
    console.error("OWNER_SEED_PASSWORD must be at least 12 characters.");
    process.exit(1);
  }
  const existing = await findAuthUser();
  if (existing) {
    const { error } = await admin.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
    });
    if (error) {
      console.error(error.message);
      process.exit(1);
    }
  } else {
    const { error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { first_name: "ClaimSaver+", last_name: "Support" },
    });
    if (error) {
      console.error(error.message);
      process.exit(1);
    }
  }
}

let { data: profile, error: profileError } = await admin
  .from("profiles")
  .select("id, email, role")
  .ilike("email", email)
  .maybeSingle();

if (!profile && password) {
  for (let i = 0; i < 10 && !profile; i += 1) {
    await new Promise((r) => setTimeout(r, 400));
    const again = await admin
      .from("profiles")
      .select("id, email, role")
      .ilike("email", email)
      .maybeSingle();
    profile = again.data;
    profileError = again.error;
  }
}

if (profileError) {
  console.error(profileError.message);
  process.exit(1);
}
if (!profile) {
  console.error(
    `No profile for ${email}. Create that Auth user first, then re-run. This script will not invent an account.`,
  );
  process.exit(1);
}

const { error: clearError } = await admin
  .from("user_roles")
  .delete()
  .eq("user_id", profile.id)
  .in("role", ["OWNER", "SUPPORT"]);
if (clearError) {
  console.error(
    "Could not write user_roles. Apply supabase/migrations/20261104180000_admin_console_foundation.sql first.",
  );
  console.error(clearError.message);
  process.exit(1);
}

const { error: roleError } = await admin.from("user_roles").insert({
  user_id: profile.id,
  role: "OWNER",
  clinic_id: null,
});
if (roleError) {
  console.error(roleError.message);
  process.exit(1);
}

const { error: profileRoleError } = await admin
  .from("profiles")
  .update({ role: "super_admin" })
  .eq("id", profile.id);
if (profileRoleError) {
  console.error(profileRoleError.message);
  process.exit(1);
}

const { data: userData, error: userError } = await admin.auth.admin.getUserById(
  profile.id,
);
if (userError || !userData.user) {
  console.error(userError?.message || "Auth user missing");
  process.exit(1);
}

const { error: metaError } = await admin.auth.admin.updateUserById(profile.id, {
  app_metadata: { ...userData.user.app_metadata, app_role: "OWNER" },
});
if (metaError) {
  console.error(metaError.message);
  process.exit(1);
}

const { error: auditError } = await admin.from("audit_events").insert({
  actor_id: profile.id,
  actor_role: "OWNER",
  action: "roles.seed_owner",
  resource_type: "user",
  resource_id: profile.id,
  metadata: { email },
});
if (auditError) {
  console.error("OWNER written, but audit insert failed:", auditError.message);
}

console.log(`OWNER seeded for ${email} (${profile.id}). Open /admin and enter the SMS code.`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
