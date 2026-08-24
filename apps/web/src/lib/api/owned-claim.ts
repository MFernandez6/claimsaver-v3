import type { SupabaseClient } from "@supabase/supabase-js";

/** Returns a claim id the caller owns, or an error if the id is not theirs. */
export async function resolveOwnedClaimId(
  admin: SupabaseClient,
  userId: string,
  claimId: string | null | undefined,
): Promise<{ claimId: string | null; error?: string }> {
  if (!claimId) return { claimId: null };
  const { data, error } = await admin
    .from("claims")
    .select("id")
    .eq("id", claimId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) return { claimId: null, error: error.message };
  if (!data) return { claimId: null, error: "Claim not found" };
  return { claimId: String(data.id) };
}
