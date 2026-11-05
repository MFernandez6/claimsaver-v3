"use client";

import { useEffect, useState } from "react";
import { webApi } from "@/lib/api/client";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/page-header";

type Lead = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string | null;
  locale: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  gclid: string | null;
  fbclid: string | null;
};

function fmtDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    webApi
      .get<{ leads: Lead[] }>("/api/v1/admin/leads")
      .then((data) => setLeads(data.leads))
      .catch((e) => setError(e instanceof Error ? e.message : "Forbidden"));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <AdminPageHeader
        kicker="Campaign"
        title="14-day leads"
        description="Checklist downloads only. No claim worksheets. Attribution is stored for ads, not enhanced matching. OWNER sees full contact details; SUPPORT sees masked emails and phones."
      />
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {!leads && !error ? <p className="text-sm text-slate-500">Loading leads…</p> : null}
      {leads?.length === 0 ? (
        <p className="text-sm text-slate-500">No checklist leads yet.</p>
      ) : null}
      <div className="space-y-3">
        {leads?.map((lead) => (
          <Card key={lead.id}>
            <CardContent className="space-y-1 py-4">
              <p className="font-medium text-slate-900">
                {lead.name || "—"} · {lead.email}
              </p>
              <p className="text-sm text-slate-600">
                {fmtDate(lead.createdAt)} · {lead.locale.toUpperCase()}
                {lead.phone ? ` · ${lead.phone}` : " · no phone"}
              </p>
              <p className="text-xs text-slate-500">
                source {lead.utmSource || "—"} · medium {lead.utmMedium || "—"} · campaign{" "}
                {lead.utmCampaign || "—"}
                {lead.gclid ? " · gclid saved" : ""}
                {lead.fbclid ? " · fbclid saved" : ""}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
