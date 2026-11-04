"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { webApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ADMIN } from "@/content/admin";

type Clinic = {
  id: string;
  legal_name: string;
  plan: string;
  baa_status: string;
  is_active: boolean;
  enrolledCount: number;
};

export default function AdminClinicsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [legalName, setLegalName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () =>
    webApi
      .get<{ clinics: Clinic[] }>("/api/v1/admin/clinics")
      .then((data) => setClinics(data.clinics))
      .catch((e) => setError(e instanceof Error ? e.message : "Forbidden"));

  useEffect(() => {
    void load();
  }, []);

  const create = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const created = await webApi.post<{ clinic: { id: string } }>("/api/v1/admin/clinics", {
        legalName,
      });
      window.location.href = `/admin/clinics/${created.clinic.id}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create clinic");
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <AdminPageHeader kicker="BAA gate" title="Clinics" description={ADMIN.clinicsNote} />
      <form onSubmit={(e) => void create(e)} className="mb-8 flex max-w-xl gap-2">
        <Input
          value={legalName}
          onChange={(e) => setLegalName(e.target.value)}
          placeholder="Legal name"
          required
        />
        <Button type="submit" disabled={busy}>
          Add clinic
        </Button>
      </form>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="space-y-3">
        {clinics.map((clinic) => (
          <Link key={clinic.id} href={`/admin/clinics/${clinic.id}`} className="block">
            <Card className="transition hover:border-teal-300">
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">{clinic.legal_name}</p>
                  <p className="text-sm text-slate-500">
                    {clinic.plan} · BAA {clinic.baa_status} ·{" "}
                    {clinic.is_active ? "enrollment open" : "enrollment closed"} ·{" "}
                    {clinic.enrolledCount} patients
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {clinics.length === 0 && !error ? (
          <p className="text-sm text-slate-500">No clinics yet.</p>
        ) : null}
      </div>
    </div>
  );
}
