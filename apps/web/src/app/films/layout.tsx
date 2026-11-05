import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAuthUser } from "@/lib/supabase/auth";
import { getStaffRole } from "@/lib/admin/roles";

export const metadata: Metadata = {
  title: "Films · ClaimSaver+",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function FilmsLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();
  if (!user) notFound();
  const role = await getStaffRole(user.id);
  if (!role) notFound();
  return children;
}
