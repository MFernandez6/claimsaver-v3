import { notFound } from "next/navigation";
import { getAuthUser, getProfile } from "@/lib/supabase/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();
  if (!user) notFound();
  const profile = await getProfile(user.id);
  if (!profile || (profile.role !== "admin" && profile.role !== "super_admin")) {
    notFound();
  }
  return children;
}
