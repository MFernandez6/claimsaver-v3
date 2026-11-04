import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { jsonErr, jsonOk } from "@/lib/supabase/auth";
import { requirePermission } from "@/lib/admin/require-permission";
import { isOnTrack } from "@/lib/admin/baa";

export async function GET(req: NextRequest) {
  const { response } = await requirePermission(req, "clinics.manage", {
    resourceType: "clinic",
    resourceId: "pilots",
  });
  if (response) return response;

  const { data: clinics, error } = await getSupabaseAdmin()
    .from("clinics")
    .select("id, legal_name, plan, pilot_start, pilot_end, baa_status, is_active")
    .eq("plan", "PILOT")
    .order("pilot_end", { ascending: true, nullsFirst: false });
  if (error) return jsonErr(error.message, 500);

  const rows = clinics ?? [];
  const ids = rows.map((row) => row.id as string);
  const enrollments = ids.length
    ? (
        await getSupabaseAdmin()
          .from("clinic_enrollments")
          .select("clinic_id, user_id")
          .in("clinic_id", ids)
      ).data ?? []
    : [];
  const userIds = enrollments.map((row) => row.user_id as string);
  const progress = new Map<string, string>();
  if (userIds.length) {
    const { data: claims } = await getSupabaseAdmin()
      .from("claims")
      .select("user_id, updated_at")
      .in("user_id", userIds);
    for (const row of claims ?? []) {
      progress.set(String(row.user_id), String(row.updated_at ?? ""));
    }
  }

  const byClinic = new Map<string, { total: number; onTrack: number }>();
  for (const row of enrollments) {
    const clinicId = String(row.clinic_id);
    const bucket = byClinic.get(clinicId) ?? { total: 0, onTrack: 0 };
    bucket.total += 1;
    if (isOnTrack(progress.get(String(row.user_id)) ?? "")) bucket.onTrack += 1;
    byClinic.set(clinicId, bucket);
  }

  const now = Date.now();
  return jsonOk({
    pilots: rows.map((clinic) => {
      const end = clinic.pilot_end ? Date.parse(String(clinic.pilot_end)) : NaN;
      const daysRemaining = Number.isFinite(end)
        ? Math.ceil((end - now) / (24 * 60 * 60 * 1000))
        : null;
      const stats = byClinic.get(clinic.id as string) ?? { total: 0, onTrack: 0 };
      const conversionAsk = daysRemaining != null && daysRemaining <= 45 && daysRemaining >= 0;
      return {
        id: clinic.id,
        name: clinic.legal_name,
        baaStatus: clinic.baa_status,
        isActive: clinic.is_active,
        daysRemaining,
        patients: stats.total,
        onTrackPct: stats.total ? Math.round((stats.onTrack / stats.total) * 100) : 0,
        conversionAsk,
      };
    }),
  });
}
