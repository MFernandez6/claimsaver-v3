import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { jsonErr, jsonOk } from "@/lib/supabase/auth";
import { requirePermission } from "@/lib/admin/require-permission";
import { writeAudit } from "@/lib/admin/audit";
import { requestIp, requestUserAgent } from "@/lib/admin/request-meta";
import { BAA_STATUSES, CLINIC_PLANS, listedMrrCents } from "@/lib/admin/baa";
import { rateLimit, rateLimitResponse, clientIp } from "@/lib/security/rate-limit";

const CLINIC_COLUMNS =
  "id, legal_name, dba, address, ahca_license, primary_contact_name, primary_contact_email, plan, pilot_start, pilot_end, baa_status, baa_signed_at, baa_document_url, enrollment_code, notes, is_active, created_at, updated_at";

export async function GET(req: NextRequest) {
  const { response } = await requirePermission(req, "clinics.manage", {
    resourceType: "clinic",
    resourceId: "list",
  });
  if (response) return response;

  const { data, error } = await getSupabaseAdmin()
    .from("clinics")
    .select(CLINIC_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) return jsonErr(error.message, 500);

  const clinics = data ?? [];
  const ids = clinics.map((row) => row.id as string);
  const counts = new Map<string, number>();
  if (ids.length) {
    const { data: enrollments } = await getSupabaseAdmin()
      .from("clinic_enrollments")
      .select("clinic_id")
      .in("clinic_id", ids);
    for (const row of enrollments ?? []) {
      const id = String(row.clinic_id);
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }

  return jsonOk({
    clinics: clinics.map((row) => ({
      ...row,
      enrolledCount: counts.get(row.id as string) ?? 0,
      listedMrrCents: listedMrrCents(String(row.plan)),
    })),
  });
}

export async function POST(req: NextRequest) {
  const limited = await rateLimit(`admin-clinic-create:${clientIp(req)}`, 20, 10 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);

  const { user, role, response } = await requirePermission(req, "clinics.manage", {
    audit: false,
  });
  if (response) return response;

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const legalName = typeof body?.legalName === "string" ? body.legalName.trim() : "";
  if (!legalName) return jsonErr("Legal name is required", 400);
  const plan = CLINIC_PLANS.includes(body?.plan as never) ? String(body?.plan) : "PILOT";
  const baaStatus = BAA_STATUSES.includes(body?.baaStatus as never)
    ? String(body?.baaStatus)
    : "NOT_SENT";
  const baaSignedAt =
    baaStatus === "SIGNED" && typeof body?.baaSignedAt === "string" ? body.baaSignedAt : null;
  if (baaStatus === "SIGNED" && !baaSignedAt) {
    return jsonErr("Signed BAA date is required", 400);
  }

  const { data, error } = await getSupabaseAdmin()
    .from("clinics")
    .insert({
      legal_name: legalName,
      dba: typeof body?.dba === "string" ? body.dba.trim() : "",
      address: typeof body?.address === "string" ? body.address.trim() : "",
      ahca_license: typeof body?.ahcaLicense === "string" ? body.ahcaLicense.trim() : "",
      primary_contact_name:
        typeof body?.primaryContactName === "string" ? body.primaryContactName.trim() : "",
      primary_contact_email:
        typeof body?.primaryContactEmail === "string"
          ? body.primaryContactEmail.trim().toLowerCase()
          : "",
      plan,
      pilot_start: typeof body?.pilotStart === "string" ? body.pilotStart : null,
      pilot_end: typeof body?.pilotEnd === "string" ? body.pilotEnd : null,
      baa_status: baaStatus,
      baa_signed_at: baaSignedAt,
      baa_document_url:
        typeof body?.baaDocumentUrl === "string" ? body.baaDocumentUrl.trim() : "",
      notes: typeof body?.notes === "string" ? body.notes.trim() : "",
      is_active: false,
    })
    .select(CLINIC_COLUMNS)
    .single();
  if (error || !data) return jsonErr(error?.message ?? "Could not create clinic", 500);

  await writeAudit({
    actorId: user.id,
    actorRole: role,
    action: "clinic.create",
    resourceType: "clinic",
    resourceId: data.id as string,
    ip: requestIp(req),
    userAgent: requestUserAgent(req),
  });

  return jsonOk({ clinic: data }, 201);
}
