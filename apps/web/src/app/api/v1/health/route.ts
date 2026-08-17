import { NextResponse } from "next/server";
import { isSupabaseBrowserConfigured } from "@/lib/supabase/env-public";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    supabaseBrowser: isSupabaseBrowserConfigured(),
    supabaseAdmin: isSupabaseConfigured(),
    stripe: Boolean(process.env.STRIPE_SECRET_KEY),
    stripeWebhook: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
  });
}
