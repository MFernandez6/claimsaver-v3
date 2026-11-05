"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { TOTAL_WORKSHEET_STEPS } from "@claimsaver/shared";
import { webApi } from "@/lib/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDisplayDate, formatDisplayDateTime } from "@/lib/utils";

type Payload = {
  clinic: {
    name: string;
    legalName?: string;
    address?: string;
    role: string;
    enrollmentOpen: boolean;
    enrollmentUrl?: string;
  };
  patients: Array<{
    displayName: string;
    enrolledAt: string;
    step: number;
    totalSteps?: number;
    status: string;
    lastActivity: string | null;
    onTrack: boolean;
  }>;
};

function statusLabel(status: string) {
  if (status === "none") return "Not started";
  if (status === "in_progress") return "In progress";
  if (status === "submitted") return "Submitted";
  if (status === "draft") return "Draft";
  return status.replaceAll("_", " ");
}

function roleLabel(role: string) {
  if (role === "CLINIC_ADMIN") return "Clinic admin";
  if (role === "CLINIC_STAFF") return "Clinic staff";
  return role;
}

export default function ClinicDashboardPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    webApi
      .get<Payload>("/api/v1/clinic/patients")
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Forbidden"));
  }, []);

  const stats = useMemo(() => {
    const patients = data?.patients ?? [];
    const total = TOTAL_WORKSHEET_STEPS;
    return {
      enrolled: patients.length,
      onTrack: patients.filter((row) => row.onTrack).length,
      behind: patients.filter((row) => !row.onTrack).length,
      complete: patients.filter((row) => row.step >= total).length,
    };
  }, [data]);

  const copyInvite = async () => {
    const url = data?.clinic.enrollmentUrl;
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16">
        <h1 className="text-2xl font-bold">Clinic staff only</h1>
        <p className="mt-3 text-base leading-relaxed text-slate-600">
          This page is for clinic administrators. If you are a claimant, your
          worksheet and documents stay on your dashboard — clinic staff never
          see them.
        </p>
        <Button asChild className="mt-6 bg-gradient-to-r from-emerald-600 to-teal-800">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    );
  }
  if (!data) return <p className="p-8 text-slate-500">Loading clinic dashboard…</p>;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">
        {roleLabel(data.clinic.role)}
      </p>
      <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{data.clinic.name}</h1>
          {data.clinic.address ? (
            <p className="mt-1 text-sm text-slate-600">{data.clinic.address}</p>
          ) : null}
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            {t("copy.clinic.visibility")} {t("copy.clinic.noReferralFees")}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          <p className="text-sm font-medium text-slate-700">
            Enrollment: {data.clinic.enrollmentOpen ? "open" : "closed (BAA required)"}
          </p>
          {data.clinic.enrollmentUrl ? (
            <Button type="button" variant="outline" onClick={() => void copyInvite()}>
              {copied ? "Invite link copied" : "Copy patient invite link"}
            </Button>
          ) : null}
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-4">
        {[
          ["Enrolled", stats.enrolled],
          ["On track", stats.onTrack],
          ["Falling behind", stats.behind],
          ["Checklist complete", stats.complete],
        ].map(([label, value]) => (
          <Card key={label}>
            <CardContent className="py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        {data.patients.length === 0 ? (
          <p className="text-sm text-slate-500">
            No enrolled patients yet. Share the invite link; patients create their own
            accounts and enroll themselves.
          </p>
        ) : (
          data.patients.map((row) => {
            const total = row.totalSteps || TOTAL_WORKSHEET_STEPS;
            const pct = Math.round((Math.min(row.step, total) / total) * 100);
            return (
              <Card key={`${row.displayName}-${row.enrolledAt}`}>
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <CardTitle className="text-base">{row.displayName}</CardTitle>
                    <span
                      className={
                        row.onTrack
                          ? "rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-800"
                          : "rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-900"
                      }
                    >
                      {row.onTrack ? "On track" : "Falling behind"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-600">
                  <div>
                    <div className="mb-1 flex justify-between text-xs font-medium">
                      <span>
                        Checklist {row.step} / {total} · {statusLabel(row.status)}
                      </span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-800"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <p>
                    Enrolled {formatDisplayDate(row.enrolledAt) || "—"}
                    {row.lastActivity
                      ? ` · last activity ${formatDisplayDateTime(row.lastActivity)}`
                      : " · no worksheet yet"}
                  </p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
