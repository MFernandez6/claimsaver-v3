import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/supabase/auth";
import { getClinicMembership, getStaffRole } from "@/lib/admin/roles";
import { AdminShell } from "@/components/admin/admin-shell";

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
    redirect("/dashboard");
  }

  return <AdminShell role={role}>{children}</AdminShell>;
}
