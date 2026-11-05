"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { webApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ADMIN } from "@/content/admin";

type Ticket = {
  id: string;
  userId: string;
  email: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
};

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("open");

  const load = (filter: string) =>
    webApi
      .get<{ tickets: Ticket[] }>(
        `/api/v1/admin/tickets${filter && filter !== "all" ? `?status=${filter}` : ""}`,
      )
      .then((data) => setTickets(data.tickets))
      .catch((e) => setError(e instanceof Error ? e.message : "Forbidden"));

  useEffect(() => {
    void load(status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const create = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const created = await webApi.post<{ ticket: { id: string } }>(
        "/api/v1/admin/tickets",
        { email, subject },
      );
      window.location.href = `/admin/support/${created.ticket.id}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open ticket");
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-8">
      <AdminPageHeader
        kicker="Inbox"
        title="Support"
        description={ADMIN.ticketBanner}
      />

      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        {ADMIN.ticketBanner}
      </div>

      <form onSubmit={(e) => void create(e)} className="mb-8 grid max-w-2xl gap-2 sm:grid-cols-[1fr_1fr_auto]">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Exact account email"
          aria-label="Account email"
        />
        <Input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject (account / billing / technical)"
          aria-label="Ticket subject"
        />
        <Button type="submit" disabled={busy}>
          Open ticket
        </Button>
      </form>

      <div className="mb-4 flex flex-wrap gap-2">
        {["open", "waiting", "closed", "all"].map((item) => (
          <Button
            key={item}
            type="button"
            variant={status === item ? "default" : "outline"}
            onClick={() => setStatus(item)}
          >
            {item}
          </Button>
        ))}
      </div>

      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

      <div className="space-y-3">
        {tickets.length === 0 ? (
          <p className="text-sm text-slate-500">No tickets in this view.</p>
        ) : (
          tickets.map((ticket) => (
            <Link key={ticket.id} href={`/admin/support/${ticket.id}`} className="block">
              <Card className="transition hover:border-teal-300">
                <CardContent className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <div>
                    <p className="font-medium">{ticket.subject}</p>
                    <p className="text-sm text-slate-500">
                      {ticket.email} · {ticket.status} · {ticket.priority}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400">
                    {new Date(ticket.updatedAt).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
