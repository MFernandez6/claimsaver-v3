import { NextRequest, NextResponse } from "next/server";
import { LEGAL_DOCUMENTS_VERSION } from "@claimsaver/shared";
import { createSupabaseServerClient } from "./server";
import { getSupabaseAdmin, isDevPlatformUnlocked, isSupabaseConfigured } from "./admin";
import type { User } from "@supabase/supabase-js";

export async function getAuthUser(req?: NextRequest): Promise<User | null> {
  const header = req?.headers.get("authorization");
  if (header?.startsWith("Bearer ")) {
    if (!isSupabaseConfigured()) return null;
    const token = header.slice(7);
    const admin = getSupabaseAdmin();
    const { data, error } = await admin.auth.getUser(token);
    if (error || !data.user) return null;
    return data.user;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    return data.user ?? null;
  } catch {
    return null;
  }
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function jsonErr(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

export async function requireUser(req: NextRequest): Promise<{
  user: User;
  response: NextResponse | null;
}> {
  const user = await getAuthUser(req);
  if (!user) {
    return { user: undefined as unknown as User, response: jsonErr("Unauthorized", 401) };
  }
  return { user, response: null };
}

export async function getProfile(userId: string) {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) return null;
  return data as {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: "user" | "admin" | "super_admin";
    has_platform_access: boolean;
    is_active: boolean;
  } | null;
}

/** true / false, or null when the consent table cannot be read (fail closed). */
export async function hasCurrentLegalConsent(userId: string): Promise<boolean | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("legal_consents")
    .select("document")
    .eq("user_id", userId)
    .eq("version", LEGAL_DOCUMENTS_VERSION);
  if (error) return null;
  const docs = new Set((data ?? []).map((row) => row.document));
  return docs.has("tos") && docs.has("privacy");
}

export async function requirePlatformAccess(req: NextRequest): Promise<{
  user: User;
  profile: Awaited<ReturnType<typeof getProfile>>;
  response: NextResponse | null;
}> {
  const { user, response } = await requireUser(req);
  if (response) return { user, profile: null, response };
  const profile = await getProfile(user.id);
  if (profile && profile.is_active === false) {
    return { user, profile, response: jsonErr("Account disabled.", 403) };
  }
  if (!profile?.has_platform_access && !isDevPlatformUnlocked()) {
    return {
      user,
      profile,
      response: jsonErr("Platform access required. Purchase $500 access to continue.", 402),
    };
  }
  const consent = await hasCurrentLegalConsent(user.id);
  if (consent === null) {
    return {
      user,
      profile,
      response: jsonErr("Could not verify legal agreement. Try again shortly.", 503),
    };
  }
  if (!consent) {
    return {
      user,
      profile,
      response: jsonErr("Accept the current Terms and Privacy Policy to continue.", 403),
    };
  }
  return { user, profile, response: null };
}

export async function requireAdmin(req: NextRequest): Promise<{
  user: User;
  profile: Awaited<ReturnType<typeof getProfile>>;
  response: NextResponse | null;
}> {
  const { user, response } = await requireUser(req);
  if (response) return { user, profile: null, response };
  const profile = await getProfile(user.id);
  if (!profile || profile.is_active === false) {
    return { user, profile, response: jsonErr("Forbidden", 403) };
  }
  if (profile.role !== "admin" && profile.role !== "super_admin") {
    return { user, profile, response: jsonErr("Forbidden", 403) };
  }
  return { user, profile, response: null };
}
