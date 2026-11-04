import { NextRequest } from "next/server";
import { requireStaff } from "@/lib/admin/require-permission";
import { writeAudit } from "@/lib/admin/audit";
import { CLAIM_ADMIN_RETIRED_MESSAGE } from "@/lib/admin/prohibited";
import { requestIp, requestUserAgent } from "@/lib/admin/request-meta";
import { jsonErr, requireUser } from "@/lib/supabase/auth";

type Ctx = { params: Promise<{ id: string }> };

async function refuse(req: NextRequest, ctx: Ctx) {
  const { user, response } = await requireUser(req);
  if (response) return response;
  const staff = await requireStaff(req);
  const { id } = await ctx.params;
  await writeAudit({
    actorId: user.id,
    actorRole: staff.role,
    action: "claims.admin_api.blocked",
    resourceType: "claim",
    resourceId: id,
    ip: requestIp(req),
    userAgent: requestUserAgent(req),
  });
  if (staff.response) return jsonErr("Forbidden", 403);
  return jsonErr(CLAIM_ADMIN_RETIRED_MESSAGE, 403);
}

/** Retired: this used to return worksheet JSON, documents, and unmasked profile. */
export async function GET(req: NextRequest, ctx: Ctx) {
  return refuse(req, ctx);
}

/** Retired: this used to insert admin_notes onto a specific claim. */
export async function POST(req: NextRequest, ctx: Ctx) {
  return refuse(req, ctx);
}
