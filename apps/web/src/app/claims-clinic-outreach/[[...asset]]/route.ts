import { readFileSync } from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/outreach/guard";

export const dynamic = "force-dynamic";

const FILES: Record<string, string> = {
  "index.html": "text/html; charset=utf-8",
  "desk.css": "text/css; charset=utf-8",
  "desk.js": "text/javascript; charset=utf-8",
  "canvass.js": "text/javascript; charset=utf-8",
  "clinic-pitch.html": "text/html; charset=utf-8",
  "clinic-one-page.html": "text/html; charset=utf-8",
  "claimsaver-plus-mark.png": "image/png",
};

const deskRoot = path.join(process.cwd(), "outreach-desk");

export async function GET(_request: NextRequest, context: { params: Promise<{ asset?: string[] }> }) {
  const staff = await requireStaff();
  if (staff.response) return staff.response;
  const { asset } = await context.params;
  const name = !asset || asset.length === 0 ? "index.html" : asset.length === 1 ? asset[0] : "";
  const type = name ? FILES[name] : undefined;
  if (!name || !type) return new NextResponse("Page not found", { status: 404 });
  const filePath = path.join(deskRoot, name);
  if (type === "image/png") {
    return new NextResponse(readFileSync(filePath), {
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Type": type,
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }
  let body = readFileSync(filePath, "utf8");
  if (name === "index.html") {
    body = body.replace(
      "<head>",
      '<head><base href="/claims-clinic-outreach/"><meta name="robots" content="noindex, nofollow">',
    );
  }
  return new NextResponse(body, {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Type": type,
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
