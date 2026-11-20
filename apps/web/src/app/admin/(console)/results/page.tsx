"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { webApi } from "@/lib/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/page-header";
import { formatUsd } from "@/lib/utils";
import { OUTREACH_STAGE_LABELS, OUTREACH_STAGES } from "@/lib/outreach/records";
import type { KpiPayload } from "@/lib/admin/kpi-types";

function rateLabel(value: number | null): string {
  if (value == null) return "—";
  return `${Math.round(value * 1000) / 10}%`;
}

export default function AdminResultsPage() {
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
        <h1 className="text-2xl font-bold">Results</h1>
        <p className="mt-3 text-slate-600">{error}</p>
        <p className="mt-2 text-sm text-slate-500">Verified payment and outreach totals are OWNER-only.</p>
      </div>
    );
  }
  if (!data) return <p className="p-8 text-slate-500">Loading verified results…</p>;

  const { actuals } = data;
  const stats = [
    { label: "Collected revenue", value: formatUsd(actuals.collectedRevenueCents), hint: "Paid platform purchases. Refunded rows are excluded." },
    { label: "Paid clients", value: String(actuals.paidClients), hint: `${actuals.paidClientsLast90Days} with a paid purchase in the last 90 days.` },
    { label: "Active paying clinics", value: String(actuals.activePayingClinics), hint: actuals.clinicBillingNote },
    { label: "Clinic MRR", value: formatUsd(actuals.clinicMrrCents), hint: "Stripe clinic subscriptions only. Listed plans are not cash." },
    { label: "Qualified demos (snapshot)", value: String(actuals.demonstrations), hint: "Clinic records currently at demo completed or later." },
    { label: "Clinic conversion", value: rateLabel(actuals.conversionRate), hint: `${actuals.converted} converted of ${actuals.clinicPipelineCount} clinic pipeline records.` },
    { label: "Closed-won rate", value: rateLabel(actuals.closedWonRate), hint: `${actuals.converted} converted, ${actuals.lost} lost.` },
    { label: "Clinic churn", value: String(actuals.churnedClinics), hint: actuals.churnNote },
    { label: "Acquisition cost", value: actuals.acquisitionCostCents == null ? "—" : formatUsd(actuals.acquisitionCostCents), hint: actuals.acquisitionCostNote },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-8">
      <AdminPageHeader
        kicker="OWNER · verified actuals"
        title="Results"
        description={`${data.source} Zero is a real number while the company is pre-revenue. Targets live on the pitch page, not in these totals.`}
      />
      {actuals.outreachQueryError ? (
        <p className="mb-6 text-sm text-amber-800">{actuals.outreachQueryError}</p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-500">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tabular-nums">{stat.value}</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">{stat.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-base">Clinic pipeline snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-slate-600">
            Current stage only. Moving a clinic forward overwrites the previous stage.
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {OUTREACH_STAGES.map((stage) => (
              <p key={stage} className="flex justify-between gap-3 text-sm">
                <span className="text-slate-600">{OUTREACH_STAGE_LABELS[stage]}</span>
                <span className="tabular-nums font-medium">{actuals.pipelineByStage[stage]}</span>
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      <p className="mt-8 text-sm text-slate-500">
        Last 90 days collected: {formatUsd(actuals.collectedRevenueLast90DaysCents)}.{" "}
        <Link href="/admin/pitch" className="text-teal-800 underline">
          Open the pitch screen
        </Link>
        {" · "}
        <Link href="/claims-clinic-outreach" className="text-teal-800 underline">
          Outreach desk
        </Link>
      </p>
    </div>
  );
}
