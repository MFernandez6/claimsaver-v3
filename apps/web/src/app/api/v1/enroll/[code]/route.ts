import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { jsonErr, jsonOk, requireUser } from "@/lib/supabase/auth";
import { canOpenEnrollment } from "@/lib/admin/baa";
import { writeAudit } from "@/lib/admin/audit";
import { requestIp, requestUserAgent } from "@/lib/admin/request-meta";

type Ctx = { params: Promise<{ code: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { code } = await ctx.params;
  const { data } = await getSupabaseAdmin()
    .from("clinics")
    .select("legal_name, dba, baa_status, is_active")
    .eq("enrollment_code", code.trim())
    .maybeSingle();
  if (!data) return jsonErr("Enrollment link is not valid", 404);
  const open = canOpenEnrollment({
    baaStatus: String(data.baa_status),
    isActive: Boolean(data.is_active),
  });
  return jsonOk({
    clinicName: data.dba || data.legal_name,
    open,
  });
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const { user, response } = await requireUser(req);
  if (response) return response;
  const { code } = await ctx.params;

  const admin = getSupabaseAdmin();
  const { data: clinic } = await admin
    .from("clinics")
    .select("id, legal_name, baa_status, is_active")
    .eq("enrollment_code", code.trim())
    .maybeSingle();
  if (!clinic) return jsonErr("Enrollment link is not valid", 404);
  if (
    !canOpenEnrollment({
      baaStatus: String(clinic.baa_status),
      isActive: Boolean(clinic.is_active),
    })
  ) {
    return jsonErr("This clinic is not accepting enrollments yet (BAA required).", 403);
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", user.id)
    .maybeSingle();
  const displayName = `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim() || "Patient";

  const { error } = await admin.from("clinic_enrollments").insert({
    clinic_id: clinic.id,
    user_id: user.id,
    display_name: displayName,
  });
  if (error) {
    if (error.code === "23505") return jsonOk({ ok: true, alreadyEnrolled: true });
    return jsonErr(error.message, 500);
  }

  await writeAudit({
    actorId: user.id,
    actorRole: "CLAIMANT",
    action: "clinic.enroll.self",
    resourceType: "clinic",
    resourceId: clinic.id as string,
    ip: requestIp(req),
    userAgent: requestUserAgent(req),
  });

  return jsonOk({ ok: true, clinicName: clinic.legal_name });
}
