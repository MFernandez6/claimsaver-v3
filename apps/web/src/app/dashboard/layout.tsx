import { pageMeta } from "@/lib/page-seo";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/supabase/auth";
import { getStaffRole } from "@/lib/admin/roles";

export const metadata = pageMeta(
  "Dashboard",
  "Your ClaimSaver+ claim workspace. Progress, documents, and PIP reminders.",
);

export const dynamic = "force-dynamic";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();
  if (user) {
    const role = await getStaffRole(user.id);
    if (role) redirect("/admin");
  }
  return children;
}
