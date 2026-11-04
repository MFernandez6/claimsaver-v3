import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { jsonErr, jsonOk } from "@/lib/supabase/auth";
import { requirePermission } from "@/lib/admin/require-permission";
import { writeAudit } from "@/lib/admin/audit";
import { requestIp, requestUserAgent } from "@/lib/admin/request-meta";
import { isUuid } from "@/lib/admin/user-query";
import { BAA_STATUSES, CLINIC_PLANS, canOpenEnrollment, isOnTrack } from "@/lib/admin/baa";
import { maskName } from "@/lib/auth/mask";
import { siteOrigin } from "@/lib/admin/mail";
import { rateLimit, rateLimitResponse, clientIp } from "@/lib/security/rate-limit";

type Ctx = { params: Promise<{ id: string }> };

const CLINIC_COLUMNS =
  "id, legal_name, dba, address, ahca_license, primary_contact_name, primary_contact_email, plan, pilot_start, pilot_end, baa_status, baa_signed_at, baa_document_url, enrollment_code, notes, is_active, created_at, updated_at";

export async function GET(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  if (!isUuid(id)) return jsonErr("Invalid clinic id", 400);

  const { response } = await requirePermission(req, "clinics.manage", {
    resourceType: "clinic",
    resourceId: id,
  });
  if (response) return response;

  const { data: clinic, error } = await getSupabaseAdmin()
    .from("clinics")
    .select(CLINIC_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) return jsonErr(error.message, 500);
  if (!clinic) return jsonErr("Not found", 404);

  const { data: enrollments } = await getSupabaseAdmin()
    .from("clinic_enrollments")
    .select("id, user_id, display_name, enrolled_at")
    .eq("clinic_id", id)
    .order("enrolled_at", { ascending: false });

  const userIds = (enrollments ?? []).map((row) => row.user_id as string);
  const progress = new Map<string, { step: number; status: string; updatedAt: string }>();
  if (userIds.length) {
    const { data: claims } = await getSupabaseAdmin()
      .from("claims")
      .select("user_id, status, worksheet_step, updated_at")
      .in("user_id", userIds);
    for (const row of claims ?? []) {
      progress.set(String(row.user_id), {
        step: Number(row.worksheet_step) || 1,
        status: String(row.status ?? "draft"),
        updatedAt: String(row.updated_at ?? ""),
      });
    }
  }

  return jsonOk({
    clinic,
    enrollmentOpen: canOpenEnrollment({
      baaStatus: String(clinic.baa_status),
      isActive: Boolean(clinic.is_active),
    }),
    enrollmentUrl: `${siteOrigin()}/enroll/${clinic.enrollment_code}`,
    patients: (enrollments ?? []).map((row) => {
      const claim = progress.get(String(row.user_id));
      return {
        enrollmentId: row.id,
        displayName: maskName(String(row.display_name || "Patient")),
        enrolledAt: row.enrolled_at,
        step: claim?.step ?? 0,
        status: claim?.status ?? "none",
        onTrack: claim ? isOnTrack(claim.updatedAt) : false,
      };
    }),
  });
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const limited = await rateLimit(`admin-clinic-write:${clientIp(req)}`, 20, 10 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);

  const { id } = await ctx.params;
  if (!isUuid(id)) return jsonErr("Invalid clinic id", 400);

  const { user, role, response } = await requirePermission(req, "clinics.manage", {
    audit: false,
  });
  if (response) return response;

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof body?.legalName === "string") patch.legal_name = body.legalName.trim();
  if (typeof body?.dba === "string") patch.dba = body.dba.trim();
  if (typeof body?.address === "string") patch.address = body.address.trim();
  if (typeof body?.ahcaLicense === "string") patch.ahca_license = body.ahcaLicense.trim();
  if (typeof body?.primaryContactName === "string") {
    patch.primary_contact_name = body.primaryContactName.trim();
  }
  if (typeof body?.primaryContactEmail === "string") {
    patch.primary_contact_email = body.primaryContactEmail.trim().toLowerCase();
  }
  if (CLINIC_PLANS.includes(body?.plan as never)) patch.plan = body?.plan;
  if (typeof body?.pilotStart === "string" || body?.pilotStart === null) {
    patch.pilot_start = body.pilotStart;
  }
  if (typeof body?.pilotEnd === "string" || body?.pilotEnd === null) patch.pilot_end = body.pilotEnd;
  if (BAA_STATUSES.includes(body?.baaStatus as never)) patch.baa_status = body?.baaStatus;
  if (typeof body?.baaSignedAt === "string" || body?.baaSignedAt === null) {
    patch.baa_signed_at = body.baaSignedAt;
  }
  if (typeof body?.baaDocumentUrl === "string") patch.baa_document_url = body.baaDocumentUrl.trim();
  if (typeof body?.notes === "string") patch.notes = body.notes.trim();
  if (typeof body?.isActive === "boolean") patch.is_active = body.isActive;

  const { data, error } = await getSupabaseAdmin()
    .from("clinics")
    .update(patch)
    .eq("id", id)
    .select(CLINIC_COLUMNS)
    .maybeSingle();
  if (error) {
    if (error.message.includes("clinics_active_requires_baa")) {
      return jsonErr("Enrollment cannot open until the BAA is SIGNED.", 400);
    }
    if (error.message.includes("clinics_baa_signed")) {
      return jsonErr("A signed BAA date is required.", 400);
    }
    return jsonErr(error.message, 400);
  }
  if (!data) return jsonErr("Not found", 404);

  await writeAudit({
    actorId: user.id,
    actorRole: role,
    action: "clinic.update",
    resourceType: "clinic",
    resourceId: id,
    metadata: { isActive: data.is_active, baaStatus: data.baa_status },
    ip: requestIp(req),
    userAgent: requestUserAgent(req),
  });

  return jsonOk({ clinic: data });
}
