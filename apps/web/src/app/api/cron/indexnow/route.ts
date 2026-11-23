import { NextRequest } from "next/server";
import { jsonErr, jsonOk } from "@/lib/supabase/auth";
import { notifyIndexNow } from "@/lib/seo/indexnow";
import { PUBLIC_INDEX_URLS } from "@/lib/seo/public-urls";

function authorized(req: NextRequest) {
  const secret = process.env.CRON_SECRET ?? "";
  if (!secret) return false;
  const header = req.headers.get("authorization") ?? "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : "";
  const query = new URL(req.url).searchParams.get("secret") ?? "";
  return bearer === secret || query === secret || req.headers.get("x-cron-secret") === secret;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return jsonErr("Unauthorized", 401);
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return jsonOk({ ok: true, skipped: "preview" });
  }
  const result = await notifyIndexNow();
  return jsonOk({ ok: result.ok, status: result.status, urls: PUBLIC_INDEX_URLS.length });
}

export async function POST(req: NextRequest) {
  return GET(req);
}
