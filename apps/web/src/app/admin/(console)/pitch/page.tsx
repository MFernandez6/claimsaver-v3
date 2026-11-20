"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { webApi } from "@/lib/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/page-header";
import { formatUsd } from "@/lib/utils";
import { ADMIN } from "@/content/admin";
import type { KpiPayload } from "@/lib/admin/kpi-types";

function money(cents: number) {
  return formatUsd(cents);
}

export default function AdminPitchPage() {
  const [data, setData] = useState<KpiPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    webApi
      .get<KpiPayload>("/api/v1/admin/kpis")
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Forbidden"));
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10 sm:px-6 sm:py-16">
        <h1 className="text-2xl font-bold">Pitch</h1>
        <p className="mt-3 text-slate-600">{error}</p>
        <p className="mt-2 text-sm text-slate-500">This screen is OWNER-only and is not public.</p>
      </div>
    );
  }
  if (!data) return <p className="p-8 text-slate-500">Loading pitch figures…</p>;

  const rows = [
    {
      label: "Paying individual clients",
      actual: String(data.actuals.paidClients),
      target: String(data.targets.payingIndividuals),
    },
    {
      label: "Active paying clinic subscriptions",
      actual: String(data.actuals.activePayingClinics),
      target: String(data.targets.payingClinicSubscriptions),
    },
    {
      label: "Qualified clinic demonstrations",
      actual: String(data.actuals.demonstrations),
      target: String(data.targets.qualifiedDemos),
    },
    {
      label: "Collected software revenue",
      actual: money(data.actuals.collectedRevenueCents),
      target: "Not a 90-day cash target",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-8">
      <AdminPageHeader
        kicker="OWNER · internal"
        title="Pitch"
        description={`${data.tagline} ClaimSaver+ is self-help software. It is not a law firm, not a public adjuster, and does not guarantee insurance outcomes or give legal advice. ${ADMIN.principle}`}
      />

      <p className="mb-8 max-w-2xl text-sm leading-relaxed text-slate-600">
        Three labeled layers. Actuals come from paid `purchases` and outreach stages.
        Targets are a 90-day operating plan. The dollar figure below is pitch planning,
        not a committed round. This page is not a public offer.
      </p>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500">Layer 1 · Actual results</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums">{money(data.actuals.collectedRevenueCents)}</p>
            <p className="mt-2 text-sm text-slate-600">
              {data.actuals.paidClients} paid clients · {data.actuals.activePayingClinics} paying clinics ·{" "}
              {data.actuals.demonstrations} qualified demos
            </p>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">{data.source}</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-amber-900">Layer 2 · {data.targets.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums text-amber-950">
              {data.targets.payingIndividuals} / {data.targets.payingClinicSubscriptions} / {data.targets.qualifiedDemos}
            </p>
            <p className="mt-2 text-sm text-amber-950">
              Paying individuals / paying clinics / qualified demos in {data.targets.windowDays} days.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-amber-900/80">
              Targets are a plan. They are not results and are not mixed into the actuals totals.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-300 bg-slate-50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500">Layer 3 · Planning</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums">${data.planning.fundingUsd.toLocaleString("en-US")}</p>
            <p className="mt-2 text-sm text-slate-600">{data.planning.label}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-base">Actual vs target</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <thead>
                <tr className="border-b text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-4 font-medium">Metric</th>
                  <th className="py-2 pr-4 font-medium">Actual</th>
                  <th className="py-2 font-medium">90-day target</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b border-slate-100">
                    <td className="py-3 pr-4 text-slate-700">{row.label}</td>
                    <td className="py-3 pr-4 font-medium tabular-nums">{row.actual}</td>
                    <td className="py-3 tabular-nums text-slate-600">{row.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <p className="mt-8 text-sm text-slate-500">
        <Link href="/admin/results" className="text-teal-800 underline">
          Full verified results
        </Link>
        {" · "}
        <Link href="/claims-clinic-outreach" className="text-teal-800 underline">
          Outreach desk
        </Link>
      </p>
    </div>
  );
}
