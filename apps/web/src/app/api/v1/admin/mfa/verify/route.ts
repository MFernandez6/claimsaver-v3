import { jsonErr } from "@/lib/supabase/auth";

export async function POST() {
  return jsonErr("Admin MFA is paused. Sign in with your password.", 410);
}
