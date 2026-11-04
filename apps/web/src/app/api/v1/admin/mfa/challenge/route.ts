import { NextResponse } from "next/server";
import { jsonErr } from "@/lib/supabase/auth";

export async function POST() {
  return jsonErr("Admin MFA is paused. Sign in with your password.", 410);
}

export async function GET() {
  return NextResponse.json({ error: "Use POST" }, { status: 405 });
}
