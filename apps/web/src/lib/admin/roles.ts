import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  highestRole,
  isAppRole,
  isStaffRole,
  type AppRole,
  type StaffRole,
} from "@/lib/auth/permissions";

export async function getUserRoles(userId: string): Promise<AppRole[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error || !data) return [];
  return data.map((row) => row.role).filter(isAppRole);
}

export async function getStaffRole(userId: string): Promise<StaffRole | null> {
  const role = highestRole(await getUserRoles(userId));
  return isStaffRole(role) ? role : null;
}

export async function getClinicMembership(userId: string): Promise<{
  role: "CLINIC_ADMIN" | "CLINIC_STAFF";
  clinicId: string;
} | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("user_roles")
    .select("role, clinic_id")
    .eq("user_id", userId)
    .in("role", ["CLINIC_ADMIN", "CLINIC_STAFF"])
    .maybeSingle();
  if (error || !data?.clinic_id) return null;
  if (data.role !== "CLINIC_ADMIN" && data.role !== "CLINIC_STAFF") return null;
  return { role: data.role, clinicId: data.clinic_id as string };
}
