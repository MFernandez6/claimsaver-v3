import { type NextRequest, type NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { jsonErr, requireUser } from "@/lib/supabase/auth";
import {
  can,
  type Permission,
  type StaffRole,
} from "@/lib/auth/permissions";
import {
  ADMIN_ABS_COOKIE,
  adminSessionStateFromRequest,
  parseCookieTime,
} from "@/lib/auth/admin-session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getStaffRole } from "./roles";
import { writeAudit } from "./audit";
import { requestIp, requestUserAgent } from "./request-meta";
import { rejectIfImpersonating } from "./impersonation";

type Ok = {
  user: User;
  role: StaffRole;
  response: null;
};

type Denied = {
  user: User | null;
  role: StaffRole | null;
  response: NextResponse;
};

export async function requireStaff(req: NextRequest): Promise<Ok | Denied> {
  const { user, response } = await requireUser(req);
  if (response) return { user: null, role: null, response };

  const role = await getStaffRole(user.id);
  if (!role || !can(role, "admin.access")) {
    return { user, role, response: jsonErr("Forbidden", 403) };
  }
  return { user, role, response: null };
}

export async function requirePermission(
  req: NextRequest,
  permission: Permission,
  opts?: { audit?: boolean; resourceType?: string; resourceId?: string },
): Promise<Ok | Denied> {
  const staff = await requireStaff(req);
  if (staff.response) return staff;

  if (!can(staff.role, permission)) {
    return { user: staff.user, role: staff.role, response: jsonErr("Forbidden", 403) };
  }

  const session = adminSessionStateFromRequest(req);
  if (session !== "ok") {
    return { user: staff.user, role: staff.role, response: jsonErr("Admin session expired", 401) };
  }

  const method = req.method.toUpperCase();
  const path = new URL(req.url).pathname;
  if (method !== "GET" && method !== "HEAD" && !path.startsWith("/api/v1/admin/impersonation")) {
    const blocked = await rejectIfImpersonating(req);
    if (blocked) {
      return { user: staff.user, role: staff.role, response: blocked };
    }
  }

  const absAt = parseCookieTime(req.cookies.get(ADMIN_ABS_COOKIE)?.value);
  const { data: lock } = await getSupabaseAdmin()
    .from("admin_ops_state")
    .select("admin_revoked_at")
    .eq("id", 1)
    .maybeSingle();
  const revokedAt = lock?.admin_revoked_at ? Date.parse(String(lock.admin_revoked_at)) : 0;
  if (revokedAt && absAt && revokedAt > absAt) {
    return {
      user: staff.user,
      role: staff.role,
      response: jsonErr("Admin sessions were revoked", 401),
    };
  }

  if (opts?.audit !== false) {
    await writeAudit({
      actorId: staff.user.id,
      actorRole: staff.role,
      action: permission,
      resourceType: opts?.resourceType ?? "",
      resourceId: opts?.resourceId ?? "",
      ip: requestIp(req),
      userAgent: requestUserAgent(req),
    });
  }

  return { user: staff.user, role: staff.role, response: null };
}
