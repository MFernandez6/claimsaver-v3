"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { webApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ADMIN, type RevealReasonId } from "@/content/admin";

type StaffUser = {
  id: string;
  email: string;
  name: string;
  phone: string;
  isActive: boolean;
  hasPlatformAccess: boolean;
  createdAt: string;
  revealed?: { email: boolean; phone: boolean; name: boolean };
};

type Detail = {
  user: StaffUser;
  actorRole: string;
  claimRecordCount: number;
  lastSignInAt: string | null;
  emailVerified: boolean;
  consents: Array<{ document: string; version: string; accepted_at: string; source: string }>;
  purchases: Array<{
    id: string;
    product_code: string;
    amount_cents: number;
    status: string;
    created_at: string;
  }>;
  tickets: Array<{
    id: string;
    subject: string;
    status: string;
    priority: string;
    created_at: string;
  }>;
  clinicEnrollments: Array<{ clinicName: string; enrolledAt: string }>;
};

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [data, setData] = useState<Detail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState<RevealReasonId>(ADMIN.revealReasons[0].id);
  const [busy, setBusy] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("Account / billing / technical");

  const load = () =>
    webApi
      .get<Detail>(`/api/v1/admin/users/${id}`)
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Forbidden"));

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16">
        <p className="text-slate-600">{error}</p>
      </div>
    );
  }
  if (!data) return <p className="p-8 text-slate-500">Loading account…</p>;

  const reveal = async () => {
    setBusy(true);
    try {
      const next = await webApi.post<{ user: StaffUser }>(
        `/api/v1/admin/users/${id}/reveal`,
        { reason, fields: { email: true, phone: true, name: true } },
      );
      setData({ ...data, user: next.user });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reveal failed");
    } finally {
      setBusy(false);
    }
  };

  const setActive = async (isActive: boolean) => {
    if (
      !window.confirm(
        isActive
          ? "Re-enable this account's sign-in?"
          : "Disable this account? They will not be able to sign in.",
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      const next = await webApi.post<{ user: StaffUser }>(`/api/v1/admin/users/${id}`, {
        isActive,
      });
      if (next.user) setData({ ...data, user: next.user });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  };

  const openTicket = async () => {
    setBusy(true);
    try {
      const created = await webApi.post<{ ticket: { id: string } }>(
        "/api/v1/admin/tickets",
        { userId: id, subject: ticketSubject },
      );
      window.location.href = `/admin/support/${created.ticket.id}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open ticket");
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <p className="mb-4 text-sm">
        <Link href="/admin/users" className="text-teal-800 hover:underline">
          ← Users
        </Link>
      </p>
      <AdminPageHeader
        kicker="Account"
        title={data.user.email}
        description="Masked by default. Claim contents are never loaded here."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Name: {data.user.name}</p>
            <p>Phone: {data.user.phone || "—"}</p>
            <p>Status: {data.user.isActive ? "active" : "disabled"}</p>
            <p>Platform access: {data.user.hasPlatformAccess ? "yes" : "no"}</p>
            <p>Email verified: {data.emailVerified ? "yes" : "no"}</p>
            <p>
              Last sign-in:{" "}
              {data.lastSignInAt
                ? new Date(data.lastSignInAt).toLocaleString()
                : "never"}
            </p>
            <p>Created: {new Date(data.user.createdAt).toLocaleString()}</p>
            <p>Claim records: {data.claimRecordCount} (count only)</p>
            <p>
              Clinic enrollments:{" "}
              {data.clinicEnrollments.length === 0
                ? "none"
                : data.clinicEnrollments
                    .map((row) => row.clinicName)
                    .join(", ")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Reveal / disable</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="block text-xs font-medium text-slate-500">
              Reveal reason
              <select
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-2 text-sm"
                value={reason}
                onChange={(e) => setReason(e.target.value as RevealReasonId)}
              >
                {ADMIN.revealReasons.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <Button
              type="button"
              className="w-full"
              disabled={busy}
              onClick={() => void reveal()}
            >
              Reveal email, phone, name
            </Button>
            {data.actorRole === "OWNER" ? (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={busy}
                onClick={() => void setActive(!data.user.isActive)}
              >
                {data.user.isActive ? "Disable account" : "Re-enable account"}
              </Button>
            ) : null}
            <p className="text-xs text-slate-500">
              Reveal writes an audit row with the reason, not the revealed values.
              Disable requires an active admin session (SMS code).
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Purchases</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {data.purchases.length === 0 ? (
              <p className="text-slate-500">None</p>
            ) : (
              <ul className="space-y-2">
                {data.purchases.map((row) => (
                  <li key={row.id}>
                    {row.product_code} · ${(row.amount_cents / 100).toFixed(2)} ·{" "}
                    {row.status} · {new Date(row.created_at).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Legal consents</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {data.consents.length === 0 ? (
              <p className="text-slate-500">None on file</p>
            ) : (
              <ul className="space-y-2">
                {data.consents.map((row) => (
                  <li key={`${row.document}-${row.accepted_at}`}>
                    {row.document} {row.version} · {row.source} ·{" "}
                    {new Date(row.accepted_at).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Support tickets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {data.tickets.length === 0 ? (
            <p className="text-slate-500">No tickets yet.</p>
          ) : (
            <ul className="space-y-2">
              {data.tickets.map((row) => (
                <li key={row.id}>
                  <Link
                    href={`/admin/support/${row.id}`}
                    className="text-teal-800 hover:underline"
                  >
                    {row.subject}
                  </Link>{" "}
                  · {row.status}
                </li>
              ))}
            </ul>
          )}
          <div className="flex max-w-xl gap-2">
            <input
              className="h-9 min-w-0 flex-1 rounded-md border border-slate-200 px-3 text-sm"
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              aria-label="New ticket subject"
            />
            <Button type="button" disabled={busy} onClick={() => void openTicket()}>
              Open ticket
            </Button>
          </div>
        </CardContent>
      </Card>

      <ImpersonationPanel
        userId={id}
        tickets={data.tickets}
        busy={busy}
        setBusy={setBusy}
        setError={setError}
      />
    </div>
  );
}

function ImpersonationPanel({
  userId,
  tickets,
  busy,
  setBusy,
  setError,
}: {
  userId: string;
  tickets: Array<{ id: string; subject: string; status: string }>;
  busy: boolean;
  setBusy: (value: boolean) => void;
  setError: (value: string | null) => void;
}) {
  const [ticketId, setTicketId] = useState(tickets[0]?.id ?? "");
  const [reason, setReason] = useState("Reproduce a software bug");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<{
    claims: Array<{ status: string; step: number; updatedAt: string }>;
    documentCount: number;
    sessions: Array<{ id: string; status: string; expires_at: string | null }>;
  } | null>(null);

  useEffect(() => {
    webApi
      .get<{
        claims: Array<{ status: string; step: number; updatedAt: string }>;
        documentCount: number;
        sessions: Array<{ id: string; status: string; expires_at: string | null }>;
      }>(`/api/v1/admin/users/${userId}/snapshot`)
      .then(setSnapshot)
      .catch(() => undefined);
  }, [userId]);

  const request = async () => {
    setBusy(true);
    setError(null);
    try {
      const created = await webApi.post<{ sessionId: string }>(
        "/api/v1/admin/impersonation",
        { userId, ticketId, reason },
      );
      setSessionId(created.sessionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not request session");
    } finally {
      setBusy(false);
    }
  };

  const join = async (id: string) => {
    setBusy(true);
    try {
      await webApi.post(`/api/v1/admin/impersonation/${id}`, { action: "join" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Join failed");
    } finally {
      setBusy(false);
    }
  };

  const end = async (id: string) => {
    setBusy(true);
    try {
      await webApi.post(`/api/v1/admin/impersonation/${id}`, { action: "end" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not end session");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-base">Consented support session</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p>{ADMIN.impersonationNote}</p>
        {snapshot ? (
          <p>
            Software snapshot: {snapshot.claims.length} claim records (step/status
            only), {snapshot.documentCount} files. Worksheet JSON is not loaded.
          </p>
        ) : null}
        {tickets.length === 0 ? (
          <p className="text-slate-500">Open a ticket first. A ticket ID is required.</p>
        ) : (
          <>
            <select
              className="w-full rounded-md border px-2 py-2"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
            >
              {tickets.map((ticket) => (
                <option key={ticket.id} value={ticket.id}>
                  {ticket.subject}
                </option>
              ))}
            </select>
            <Input value={reason} onChange={(e) => setReason(e.target.value)} />
            <Button type="button" disabled={busy || !ticketId} onClick={() => void request()}>
              Ask claimant to approve a 30-minute view
            </Button>
          </>
        )}
        {sessionId ? (
          <p className="text-teal-800">
            Request sent. After they approve, join session {sessionId.slice(0, 8)}…
            <Button
              type="button"
              variant="outline"
              className="ml-2"
              onClick={() => void join(sessionId)}
            >
              Join if approved
            </Button>
          </p>
        ) : null}
        {snapshot?.sessions
          .filter((row) => row.status === "active")
          .map((row) => (
            <div key={row.id} className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => void join(row.id)}>
                Join active session
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => void end(row.id)}
              >
                End session
              </Button>
            </div>
          ))}
      </CardContent>
    </Card>
  );
}
