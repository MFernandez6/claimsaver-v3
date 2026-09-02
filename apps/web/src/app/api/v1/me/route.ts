import { NextRequest } from "next/server";
import { LEGAL_DOCUMENTS_VERSION } from "@claimsaver/shared";
import { jsonOk, requireUser, getProfile, hasCurrentLegalConsent } from "@/lib/supabase/auth";
import { nameFromAuthUser } from "@/lib/auth/display-name";
import { getSupabaseAdmin, isDevPlatformUnlocked } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const { user, response } = await requireUser(req);
  if (response) return response;
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  let profile = await getProfile(user.id);
  if (!profile) {
    const { error } = await getSupabaseAdmin().from("profiles").upsert({
      id: user.id,
      email: user.email ?? "",
      first_name: String(meta.first_name ?? ""),
      last_name: String(meta.last_name ?? ""),
    });
    if (!error) profile = await getProfile(user.id);
  }

  const consent = await hasCurrentLegalConsent(user.id);
  const legalConsentCurrent = consent === true;

  return jsonOk({
    id: profile?.id ?? user.id,
    email: profile?.email || user.email || "",
    firstName: profile?.first_name || nameFromAuthUser(user),
    lastName: profile?.last_name || String(meta.last_name ?? ""),
    role: profile?.role ?? "user",
    isActive: profile?.is_active !== false,
    hasPlatformAccess:
      (Boolean(profile?.has_platform_access) && profile?.is_active !== false) ||
      isDevPlatformUnlocked(),
    legalConsentCurrent,
    legalVersion: LEGAL_DOCUMENTS_VERSION,
  });
}
