import type { Metadata } from "next";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { canOpenEnrollment } from "@/lib/admin/baa";
import { EnrollClient, EnrollInvalid } from "./enroll-client";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ code: string }> };

async function lookupInvite(code: string) {
  const trimmed = code.trim();
  if (!trimmed) return null;
  const { data } = await getSupabaseAdmin()
    .from("clinics")
    .select("legal_name, dba, baa_status, is_active")
    .eq("enrollment_code", trimmed)
    .maybeSingle();
  if (!data) return null;
  return {
    clinicName: String(data.dba || data.legal_name || "This clinic"),
    open: canOpenEnrollment({
      baaStatus: String(data.baa_status),
      isActive: Boolean(data.is_active),
    }),
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  const invite = await lookupInvite(code);
  if (!invite) {
    return { title: "This link isn't valid" };
  }
  return { title: `${invite.clinicName} invited you` };
}

export default async function EnrollPage({ params }: PageProps) {
  const { code } = await params;
  const invite = await lookupInvite(code);
  if (!invite) {
    return <EnrollInvalid />;
  }

  return <EnrollClient code={code} clinicName={invite.clinicName} open={invite.open} />;
}
