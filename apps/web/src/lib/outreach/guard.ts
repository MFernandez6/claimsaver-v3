import { NextResponse } from "next/server";
import { getStaffRole } from "@/lib/admin/roles";
import { getAuthUser } from "@/lib/supabase/auth";

export async function requireStaff() {
  const user = await getAuthUser();
  if (!user) {
    return {
      response: NextResponse.json({ error: "Please sign in to use the outreach desk." }, { status: 401 }),
    };
  }
  const role = await getStaffRole(user.id);
  if (!role) {
    return { response: new NextResponse("Page not found", { status: 404 }) };
  }
  return { response: null as NextResponse | null };
}
