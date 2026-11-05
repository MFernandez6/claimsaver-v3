import { NextRequest } from "next/server";
import { TOTAL_WORKSHEET_STEPS } from "@claimsaver/shared";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { jsonErr, jsonOk, requireUser } from "@/lib/supabase/auth";
import { getClinicMembership } from "@/lib/admin/roles";
import { canOpenEnrollment, isOnTrack } from "@/lib/admin/baa";
import { siteUrl } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { user, response } = await requireUser(req);
  if (response) return response;

  const membership = await getClinicMembership(user.id);
  if (!membership) {
    return jsonErr("This page is for clinic staff. Claimants use the dashboard.", 403);
  }

  const { data: clinic, error } = await getSupabaseAdmin()
    .from("clinics")
    .select("id, legal_name, dba, address, baa_status, is_active, enrollment_code")
    .eq("id", membership.clinicId)
    .maybeSingle();
  if (error) return jsonErr(error.message, 500);
  if (!clinic) return jsonErr("Clinic not found", 404);

  const { data: enrollments } = await getSupabaseAdmin()
    .from("clinic_enrollments")
    .select("id, display_name, enrolled_at, user_id")
    .eq("clinic_id", membership.clinicId)
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

  const patients = (enrollments ?? []).map((row) => {
    const claim = progress.get(String(row.user_id));
    const step = claim?.step ?? 0;
    return {
      displayName: String(row.display_name || "Patient"),
      enrolledAt: row.enrolled_at,
      step,
      totalSteps: TOTAL_WORKSHEET_STEPS,
      status: claim?.status ?? "none",
      lastActivity: claim?.updatedAt ?? null,
      onTrack: claim ? isOnTrack(claim.updatedAt) : false,
    };
  });
  patients.sort((a, b) => Number(a.onTrack) - Number(b.onTrack) || b.step - a.step);

  return jsonOk({
    clinic: {
      id: clinic.id,
      name: String(clinic.dba || clinic.legal_name),
      legalName: String(clinic.legal_name),
      address: String(clinic.address || ""),
      role: membership.role,
      enrollmentOpen: canOpenEnrollment({
        baaStatus: String(clinic.baa_status),
        isActive: Boolean(clinic.is_active),
      }),
      enrollmentUrl: `${siteUrl()}/enroll/${clinic.enrollment_code}`,
    },
    patients,
  });
}
