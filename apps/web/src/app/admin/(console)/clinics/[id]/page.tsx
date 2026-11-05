"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { webApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ADMIN } from "@/content/admin";

type Detail = {
  clinic: {
    id: string;
    legal_name: string;
    dba: string;
    address: string;
    ahca_license: string;
    primary_contact_name: string;
    primary_contact_email: string;
    plan: string;
    pilot_start: string | null;
    pilot_end: string | null;
    baa_status: string;
    baa_signed_at: string | null;
    baa_document_url: string;
    enrollment_code: string;
    notes: string;
    is_active: boolean;
  };
  enrollmentOpen: boolean;
  enrollmentUrl: string;
  patients: Array<{
    enrollmentId: string;
    displayName: string;
    enrolledAt: string;
    step: number;
    status: string;
    onTrack: boolean;
  }>;
};

export default function AdminClinicDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [data, setData] = useState<Detail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [baaStatus, setBaaStatus] = useState("NOT_SENT");
  const [baaSignedAt, setBaaSignedAt] = useState("");
  const [active, setActive] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  const load = () =>
    webApi
      .get<Detail>(`/api/v1/admin/clinics/${id}`)
      .then((next) => {
        setData(next);
        setBaaStatus(next.clinic.baa_status);
        setBaaSignedAt(next.clinic.baa_signed_at ?? "");
        setActive(next.clinic.is_active);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Forbidden"));

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const inviteAdmin = async () => {
    setBusy(true);
    setError(null);
    try {
      await webApi.post("/api/v1/admin/roles", {
        email: adminEmail,
        role: "CLINIC_ADMIN",
        clinicId: id,
      });
      setAdminEmail("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invite failed");
    } finally {
      setBusy(false);
    }
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await webApi.post(`/api/v1/admin/clinics/${id}`, {
        baaStatus,
        baaSignedAt: baaStatus === "SIGNED" ? baaSignedAt || new Date().toISOString().slice(0, 10) : null,
        isActive: active,
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  if (error && !data) return <p className="p-8 text-slate-600">{error}</p>;
  if (!data) return <p className="p-8 text-slate-500">Loading clinic…</p>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-8">
      <p className="mb-4 text-sm">
        <Link href="/admin/clinics" className="text-teal-800 hover:underline">
          ← Clinics
        </Link>
      </p>
      <AdminPageHeader kicker="Clinic" title={data.clinic.legal_name} description={ADMIN.clinicsNote} />

      <form onSubmit={(e) => void save(e)} className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">BAA / enrollment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <label className="block">
              BAA status
              <select
                className="mt-1 w-full rounded-md border px-2 py-2"
                value={baaStatus}
                onChange={(e) => setBaaStatus(e.target.value)}
              >
                <option value="NOT_SENT">NOT_SENT</option>
                <option value="SENT">SENT</option>
                <option value="SIGNED">SIGNED</option>
              </select>
            </label>
            <label className="block">
              Signed date
              <Input
                type="date"
                value={baaSignedAt}
                onChange={(e) => setBaaSignedAt(e.target.value)}
              />
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
              Open enrollment (requires SIGNED BAA)
            </label>
            <p>Enrollment: {data.enrollmentOpen ? "open" : "closed"}</p>
            <p className="break-all text-xs text-slate-500">{data.enrollmentUrl}</p>
            {error ? <p className="text-red-700">{error}</p> : null}
            <Button type="submit" disabled={busy} className="w-full sm:w-auto">
              Save
            </Button>
            <div className="border-t pt-3">
              <p className="mb-2 font-medium">Invite CLINIC_ADMIN</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  type="email"
                  placeholder="clinic-admin@example.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  disabled={busy || !adminEmail}
                  onClick={() => void inviteAdmin()}
                >
                  Invite
                </Button>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Clinic staff use /clinic. They never see worksheet contents.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Enrolled patients (progress only)</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {data.patients.length === 0 ? (
              <p className="text-slate-500">None yet. Patients enroll themselves via the link.</p>
            ) : (
              <ul className="space-y-2">
                {data.patients.map((row) => (
                  <li key={row.enrollmentId}>
                    {row.displayName} · step {row.step} · {row.status} ·{" "}
                    {row.onTrack ? "on track" : "falling behind"}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
