import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/supabase/auth";
import { getClinicMembership, getStaffRole } from "@/lib/admin/roles";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  ADMIN_ABS_COOKIE,
  ADMIN_IDLE_COOKIE,
  adminSessionState,
  mfaPath,
  parseCookieTime,
} from "@/lib/auth/admin-session";

export default async function AdminConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();
  if (!user) redirect("/login?next=/admin");
  const role = await getStaffRole(user.id);
  if (!role) {
    const clinic = await getClinicMembership(user.id);
    if (clinic) redirect("/clinic");
    redirect("/admin/mfa");
  }

  const store = await cookies();
  const state = adminSessionState(
    parseCookieTime(store.get(ADMIN_IDLE_COOKIE)?.value),
    parseCookieTime(store.get(ADMIN_ABS_COOKIE)?.value),
  );
  if (state !== "ok") redirect(mfaPath(state));

  return <AdminShell role={role}>{children}</AdminShell>;
}
