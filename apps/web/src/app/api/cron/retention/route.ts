import { NextRequest } from "next/server";
import { jsonErr, jsonOk } from "@/lib/supabase/auth";
import { runRetentionJob } from "@/lib/admin/run-retention";

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
  const counts = await runRetentionJob();
  return jsonOk({ ok: true, counts });
}

export async function POST(req: NextRequest) {
  return GET(req);
}
