import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { jsonErr, jsonOk, requireUser } from "@/lib/supabase/auth";
import { getClinicMembership } from "@/lib/admin/roles";
import { canOpenEnrollment, isOnTrack } from "@/lib/admin/baa";

export async function GET(req: NextRequest) {
  const { user, response } = await requireUser(req);
  if (response) return response;

  const membership = await getClinicMembership(user.id);
  if (!membership) return jsonErr("Forbidden", 403);

  const { data: clinic, error } = await getSupabaseAdmin()
    .from("clinics")
    .select("id, legal_name, baa_status, is_active, enrollment_code")
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

  return jsonOk({
    clinic: {
      id: clinic.id,
      name: clinic.legal_name,
      role: membership.role,
      enrollmentOpen: canOpenEnrollment({
        baaStatus: String(clinic.baa_status),
        isActive: Boolean(clinic.is_active),
      }),
    },
    patients: (enrollments ?? []).map((row) => {
      const claim = progress.get(String(row.user_id));
      return {
        displayName: String(row.display_name || "Patient"),
        enrolledAt: row.enrolled_at,
        step: claim?.step ?? 0,
        status: claim?.status ?? "none",
        lastActivity: claim?.updatedAt ?? null,
        onTrack: claim ? isOnTrack(claim.updatedAt) : false,
      };
    }),
  });
}
