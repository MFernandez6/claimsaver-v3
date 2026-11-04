import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAuthUser } from "@/lib/supabase/auth";
import { getStaffRole } from "@/lib/admin/roles";

export const metadata: Metadata = {
  title: "Admin · ClaimSaver+",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();
  if (!user) notFound();
  const role = await getStaffRole(user.id);
  if (!role) notFound();

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden bg-slate-950">{children}</div>
  );
}
