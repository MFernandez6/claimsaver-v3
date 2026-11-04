"use client";

import { useEffect, useState } from "react";
import { webApi } from "@/lib/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Payload = {
  clinic: { name: string; role: string; enrollmentOpen: boolean };
  patients: Array<{
    displayName: string;
    enrolledAt: string;
    step: number;
    status: string;
    lastActivity: string | null;
    onTrack: boolean;
  }>;
};

export default function ClinicDashboardPage() {
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    webApi
      .get<Payload>("/api/v1/clinic/patients")
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Forbidden"));
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16">
        <h1 className="text-2xl font-bold">Clinic</h1>
        <p className="mt-3 text-slate-600">{error}</p>
      </div>
    );
  }
  if (!data) return <p className="p-8 text-slate-500">Loading clinic dashboard…</p>;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">
        {data.clinic.role}
      </p>
      <h1 className="mt-1 text-3xl font-bold">{data.clinic.name}</h1>
      <p className="mt-2 text-sm text-slate-600">
        Enrolled patients’ checklist progress only. You cannot open a claimant’s
        worksheet, documents, or medical details.
      </p>
      <p className="mt-2 text-sm">
        Enrollment: {data.clinic.enrollmentOpen ? "open" : "closed (BAA required)"}
      </p>
      <div className="mt-8 space-y-3">
        {data.patients.length === 0 ? (
          <p className="text-sm text-slate-500">No enrolled patients yet.</p>
        ) : (
          data.patients.map((row) => (
            <Card key={`${row.displayName}-${row.enrolledAt}`}>
              <CardHeader>
                <CardTitle className="text-base">{row.displayName}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Step {row.step} · {row.status} ·{" "}
                {row.onTrack ? "on track" : "falling behind"}
                {row.lastActivity
                  ? ` · last activity ${new Date(row.lastActivity).toLocaleDateString()}`
                  : ""}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
