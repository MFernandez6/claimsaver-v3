"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { webApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ADMIN } from "@/content/admin";

type RequestRow = {
  id: string;
  userId: string;
  email: string;
  status: string;
  createdAt: string;
  approvedAt: string | null;
  hardDeleteAfter: string | null;
};

type ExportRow = {
  id: string;
  userId: string;
  status: string;
  createdAt: string;
  expiresAt: string;
};

export default function AdminPrivacyPage() {
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [exports, setExports] = useState<ExportRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = () =>
    webApi
      .get<{ requests: RequestRow[]; exports?: ExportRow[] }>("/api/v1/admin/privacy")
      .then((data) => {
        setRows(data.requests);
        setExports(data.exports ?? []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Forbidden"));

  useEffect(() => {
    void load();
  }, []);

  const schedule = async (id: string) => {
    if (
      !window.confirm(
        "Disable this account now and hard-delete personal data in 30 days? Billing and audit rows are kept.",
      )
    ) {
      return;
    }
    setBusy(id);
    setError(null);
    try {
      await webApi.post(`/api/v1/admin/deletion-requests/${id}`, {});
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not schedule deletion");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-8">
      <AdminPageHeader
        kicker="FIPA / deletion"
        title="Privacy requests"
        description={ADMIN.privacyNote}
      />

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <div className="space-y-3">
        {rows.length === 0 && !error ? (
          <p className="text-sm text-slate-500">No deletion requests on file.</p>
        ) : (
          rows.map((row) => (
            <Card key={row.id}>
              <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="break-words font-medium">{row.email}</p>
                  <p className="text-sm text-slate-500">
                    {row.status} · {new Date(row.createdAt).toLocaleString()}
                    {row.hardDeleteAfter
                      ? ` · hard-delete after ${new Date(row.hardDeleteAfter).toLocaleDateString()}`
                      : ""}
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <Link
                    href={`/admin/users/${row.userId}`}
                    className="text-sm text-teal-800 hover:underline"
                  >
                    Open account
                  </Link>
                  {row.status === "pending" ? (
                    <Button
                      type="button"
                      size="sm"
                      className="w-full sm:w-auto"
                      disabled={busy === row.id}
                      onClick={() => void schedule(row.id)}
                    >
                      Schedule 30-day deletion
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <h2 className="mt-10 text-lg font-semibold">User exports</h2>
      <p className="mb-3 text-sm text-slate-500">
        Metadata only. Staff cannot download the claimant’s JSON package.
      </p>
      {exports.length === 0 ? (
        <p className="text-sm text-slate-500">No export requests on file.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {exports.map((row) => (
            <li key={row.id}>
              {row.status} · {new Date(row.createdAt).toLocaleString()} · expires{" "}
              {new Date(row.expiresAt).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
