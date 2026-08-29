import { createClient } from "@supabase/supabase-js";
import { SKIP_PAYMENTS_FOR_PROMO } from "@claimsaver/shared";

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

/** Unlocks worksheets without a purchase. Promo filming, or local DEV_UNLOCK_PLATFORM. */
export function isDevPlatformUnlocked() {
  if (SKIP_PAYMENTS_FOR_PROMO) return true;
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.DEV_UNLOCK_PLATFORM === "true"
  );
}

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase admin client is not configured");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
