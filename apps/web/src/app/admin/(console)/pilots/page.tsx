"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { webApi } from "@/lib/api/client";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/page-header";

type Pilot = {
  id: string;
  name: string;
  baaStatus: string;
  isActive: boolean;
  daysRemaining: number | null;
  patients: number;
  onTrackPct: number;
  conversionAsk: boolean;
};

export default function AdminPilotsPage() {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    webApi
      .get<{ pilots: Pilot[] }>("/api/v1/admin/pilots")
      .then((data) => setPilots(data.pilots))
      .catch((e) => setError(e instanceof Error ? e.message : "Forbidden"));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <AdminPageHeader
        kicker="Business ops"
        title="Pilot tracker"
        description="Counts and percentages only. No claim contents."
      />
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <div className="space-y-3">
        {pilots.map((pilot) => (
          <Link key={pilot.id} href={`/admin/clinics/${pilot.id}`} className="block">
            <Card className="transition hover:border-teal-300">
              <CardContent className="py-4 text-sm">
                <p className="font-medium">{pilot.name}</p>
                <p className="text-slate-500">
                  BAA {pilot.baaStatus} · {pilot.patients} patients · {pilot.onTrackPct}% on
                  track
                  {pilot.daysRemaining != null ? ` · ${pilot.daysRemaining} days left` : ""}
                  {pilot.conversionAsk ? " · Day-45 conversion ask" : ""}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
        {pilots.length === 0 && !error ? (
          <p className="text-sm text-slate-500">No PILOT clinics.</p>
        ) : null}
      </div>
    </div>
  );
}
