import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { clientIp } from "@/lib/security/rate-limit";

export function requestIp(req: NextRequest) {
  return clientIp(req);
}

export function requestUserAgent(req: NextRequest) {
  return req.headers.get("user-agent") || "";
}

export async function serverRequestMeta() {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for")?.split(",")[0]?.trim();
  return {
    ip: forwarded || headerList.get("x-real-ip") || "",
    userAgent: headerList.get("user-agent") || "",
  };
}
