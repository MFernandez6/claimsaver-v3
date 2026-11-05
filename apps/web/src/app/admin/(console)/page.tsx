"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { webApi } from "@/lib/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ADMIN } from "@/content/admin";

type Overview = {
  actor: { role: string; email: string };
  counts: {
    users: number;
    usersNewWeek: number;
    claims: number;
    pendingDeletions: number;
    leads14days: number;
    leads14daysWeek: number;
    openTickets: number;
    staff: number;
    clinics?: number;
    pilots?: number;
  };
  health: {
    database: boolean;
    lastAuditAt: string | null;
    messaging: string;
  };
};

export default function AdminOverviewPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    webApi
      .get<Overview>("/api/v1/admin/overview")
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Forbidden"));
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10 sm:px-6 sm:py-16">
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="mt-3 text-slate-600">{error}</p>
      </div>
    );
  }
  if (!data) return <p className="p-8 text-slate-500">Loading admin overview…</p>;

  const stats = [
    { label: "Accounts", value: data.counts.users, hint: `${data.counts.usersNewWeek} new this week`, href: "/admin/users" },
    { label: "Claim records", value: data.counts.claims, hint: "Count only. Contents stay with the claimant." },
    { label: "Open tickets", value: data.counts.openTickets, href: "/admin/support" },
    { label: "Pending deletions", value: data.counts.pendingDeletions, hint: "Disable now, hard-delete in 30 days.", href: "/admin/privacy" },
    { label: "14-day leads", value: data.counts.leads14days, hint: `${data.counts.leads14daysWeek} this week`, href: "/admin/leads" },
    { label: "Clinics", value: data.counts.clinics ?? 0, hint: `${data.counts.pilots ?? 0} pilots`, href: "/admin/clinics" },
    { label: "Staff seats", value: data.counts.staff, href: "/admin/roles" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-8">
      <AdminPageHeader
        kicker="Software operations"
        title="Overview"
        description={`Signed in as ${data.actor.email} (${data.actor.role}). ${ADMIN.principle}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const inner = (
            <>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-slate-500">
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold tabular-nums">{stat.value}</p>
                {stat.hint ? (
                  <p className="mt-2 text-xs text-slate-500">{stat.hint}</p>
                ) : null}
              </CardContent>
            </>
          );
          return stat.href ? (
            <Link key={stat.label} href={stat.href} className="block">
              <Card className="h-full transition hover:border-teal-300">{inner}</Card>
            </Link>
          ) : (
            <Card key={stat.label}>{inner}</Card>
          );
        })}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">System health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>Database: {data.health.database ? "connected" : "not configured"}</p>
            <p>
              Last audit event:{" "}
              {data.health.lastAuditAt
                ? new Date(data.health.lastAuditAt).toLocaleString()
                : "none yet"}
            </p>
            <p>
              Messaging: ticket replies email the claimant with an account-only
              footer. Claim-substance advice is still prohibited.
            </p>
            <p className="text-xs text-slate-500">{ADMIN.clinicsNote}</p>
            <p className="text-xs text-slate-500">{ADMIN.impersonationNote}</p>
            <p className="text-xs text-slate-500">{ADMIN.privacyNote}</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-base">Prohibited in this console</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
              {ADMIN.prohibited.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
