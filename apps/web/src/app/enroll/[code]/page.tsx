import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { canOpenEnrollment } from "@/lib/admin/baa";
import { EnrollClient } from "./enroll-client";

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
    return (
      <div className="mx-auto max-w-lg px-6 py-16">
        <BrandLogo className="mb-8" />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">Clinic invitation</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">This link isn't valid</h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600">
          This clinic invitation is missing or expired. Ask the clinic for a new link, or go
          back to ClaimSaver+.
        </p>
        <p className="mt-6">
          <Link href="/" className="text-sm font-medium text-teal-800 underline underline-offset-2">
            Back to ClaimSaver+
          </Link>
        </p>
      </div>
    );
  }

  return <EnrollClient code={code} clinicName={invite.clinicName} open={invite.open} />;
}
