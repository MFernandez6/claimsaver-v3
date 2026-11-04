"use client";

import { useEffect, useState } from "react";
import { webApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";

type Payload = {
  pending: Array<{ id: string; reason: string; requested_at: string }>;
  activity: Array<{ id: string; kind: string; body: string; created_at: string }>;
};

export function SupportAccessBanner() {
  const [data, setData] = useState<Payload | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = () =>
    webApi
      .get<Payload>("/api/v1/account/support-access")
      .then(setData)
      .catch(() => undefined);

  useEffect(() => {
    void load();
  }, []);

  const decide = async (sessionId: string, decision: "approve" | "deny") => {
    setBusy(sessionId);
    try {
      await webApi.post("/api/v1/account/support-access", { sessionId, decision });
      await load();
    } finally {
      setBusy(null);
    }
  };

  const exportData = async () => {
    const created = await webApi.post<{ token: string }>("/api/v1/account/privacy-export", {});
    const res = await fetch(`/api/v1/account/privacy-export?token=${created.token}`, {
      credentials: "include",
    });
    const json = await res.json();
    const blob = new Blob([JSON.stringify(json.data?.export ?? json, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "claimsaver-plus-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!data) return null;
  const views = data.activity.filter((row) => row.kind === "support_view");

  return (
    <div className="mb-6 space-y-3">
      {data.pending.map((row) => (
        <div
          key={row.id}
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
        >
          <p>
            ClaimSaver+ Support asked to view your account for 30 minutes to fix a
            software issue. They cannot change your filing.
          </p>
          <p className="mt-1 text-xs">{row.reason}</p>
          <div className="mt-3 flex gap-2">
            <Button
              type="button"
              disabled={busy === row.id}
              onClick={() => void decide(row.id, "approve")}
            >
              Allow for 30 minutes
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={busy === row.id}
              onClick={() => void decide(row.id, "deny")}
            >
              Deny
            </Button>
          </div>
        </div>
      ))}
      {views.map((row) => (
        <p key={row.id} className="text-xs text-slate-500">
          {row.body}
        </p>
      ))}
      <p className="text-xs text-slate-500">
        <button type="button" className="underline" onClick={() => void exportData()}>
          Download a copy of my data
        </button>
      </p>
    </div>
  );
}
