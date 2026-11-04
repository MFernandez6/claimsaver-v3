"use client";

import { useEffect, useState } from "react";
import { webApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/page-header";

type System = {
  database: boolean;
  retentionYears: number;
  failedMessages24h: number;
  lastCron: Array<{ job: string; ran_at: string; counts: Record<string, number> }>;
  lastRevokedAt: string | null;
};

export default function AdminSystemPage() {
  const [data, setData] = useState<System | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () =>
    webApi
      .get<System>("/api/v1/admin/system")
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Forbidden"));

  useEffect(() => {
    void load();
  }, []);

  const revoke = async () => {
    if (!window.confirm("Sign out every OWNER and SUPPORT session now?")) return;
    setBusy(true);
    try {
      await webApi.post("/api/v1/admin/system", { action: "revoke_admin_sessions" });
      window.location.href = "/admin/mfa?reason=absolute";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Revoke failed");
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <AdminPageHeader
        kicker="OWNER tools"
        title="System health"
        description="Retention years are a placeholder until counsel confirms. See docs/incident-response.md."
      />
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      {data ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>Database: {data.database ? "connected" : "not configured"}</p>
              <p>Retention years (placeholder): {data.retentionYears}</p>
              <p>Failed ticket emails (24h): {data.failedMessages24h}</p>
              <p>
                Last emergency revoke:{" "}
                {data.lastRevokedAt
                  ? new Date(data.lastRevokedAt).toLocaleString()
                  : "never"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Retention cron</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {data.lastCron.length === 0 ? (
                <p className="text-slate-500">No runs yet.</p>
              ) : (
                <ul className="space-y-2">
                  {data.lastCron.map((row) => (
                    <li key={row.ran_at}>
                      {row.job} · {new Date(row.ran_at).toLocaleString()} ·{" "}
                      {JSON.stringify(row.counts)}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <p className="text-slate-500">Loading…</p>
      )}
      <Button
        type="button"
        className="mt-8 bg-red-700 hover:bg-red-800"
        disabled={busy}
        onClick={() => void revoke()}
      >
        Emergency: revoke all admin sessions
      </Button>
    </div>
  );
}
