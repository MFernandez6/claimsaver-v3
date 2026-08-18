import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { safeNextPath, withQueryParam } from "@/lib/auth/next-path";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const next = safeNextPath(req.nextUrl.searchParams.get("next"), "/dashboard");
  if (code) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }
  const dest = withQueryParam(next, "email_confirmed", "1");
  return NextResponse.redirect(new URL(dest, req.url));
}
