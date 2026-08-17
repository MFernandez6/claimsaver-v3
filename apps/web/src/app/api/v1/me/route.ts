import { NextRequest } from "next/server";
import { jsonErr, jsonOk, requireUser, getProfile } from "@/lib/supabase/auth";

export async function GET(req: NextRequest) {
  const { user, response } = await requireUser(req);
  if (response) return response;
  let profile = await getProfile(user.id);
  if (!profile) {
    const { getSupabaseAdmin } = await import("@/lib/supabase/admin");
    const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
    await getSupabaseAdmin().from("profiles").upsert({
      id: user.id,
      email: user.email ?? "",
      first_name: String(meta.first_name ?? ""),
      last_name: String(meta.last_name ?? ""),
    });
    profile = await getProfile(user.id);
  }
  if (!profile) return jsonErr("Profile not found", 404);
  return jsonOk({
    id: profile.id,
    email: profile.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    role: profile.role,
    hasPlatformAccess: profile.has_platform_access,
  });
}
