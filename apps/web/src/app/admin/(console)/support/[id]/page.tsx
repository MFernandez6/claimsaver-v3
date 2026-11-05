"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { webApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ADMIN } from "@/content/admin";

type Message = {
  id: string;
  author_kind: string;
  body: string;
  created_at: string;
};

type TicketDetail = {
  ticket: {
    id: string;
    user_id: string;
    subject: string;
    status: string;
    priority: string;
    created_at: string;
  };
  user: { id: string; email: string; name: string } | null;
  messages: Message[];
};

export default function AdminTicketDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [data, setData] = useState<TicketDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("open");
  const [busy, setBusy] = useState(false);

  const load = () =>
    webApi
      .get<TicketDetail>(`/api/v1/admin/tickets/${id}`)
      .then((next) => {
        setData(next);
        setStatus(next.ticket.status);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Forbidden"));

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const reply = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await webApi.post(`/api/v1/admin/tickets/${id}`, { body, status });
      setBody("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reply failed");
    } finally {
      setBusy(false);
    }
  };

  if (error && !data) {
    return <p className="p-8 text-slate-600">{error}</p>;
  }
  if (!data) return <p className="p-8 text-slate-500">Loading ticket…</p>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-8">
      <p className="mb-4 text-sm">
        <Link href="/admin/support" className="text-teal-800 hover:underline">
          ← Support
        </Link>
      </p>
      <AdminPageHeader kicker="Ticket" title={data.ticket.subject} />

      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        {ADMIN.ticketBanner}
      </div>

      <p className="mb-6 text-sm text-slate-600">
        Account:{" "}
        {data.user ? (
          <Link
            href={`/admin/users/${data.user.id}`}
            className="text-teal-800 hover:underline"
          >
            {data.user.email}
          </Link>
        ) : (
          "unknown"
        )}{" "}
        · {data.ticket.status}
      </p>

      <div className="space-y-3">
        {data.messages.length === 0 ? (
          <p className="text-sm text-slate-500">No replies yet.</p>
        ) : (
          data.messages.map((message) => (
            <Card key={message.id}>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-slate-500">
                  {message.author_kind} ·{" "}
                  {new Date(message.created_at).toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm">{message.body}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <form onSubmit={(e) => void reply(e)} className="mt-8 space-y-3">
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={8}
          placeholder="Account, billing, or technical reply only"
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => setBody(ADMIN.claimQuestionMacro)}
          >
            Insert “Claim question” macro
          </Button>
          <select
            className="w-full rounded-md border border-slate-200 bg-white px-2 py-2 text-sm sm:w-auto"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="open">open</option>
            <option value="waiting">waiting</option>
            <option value="closed">closed</option>
          </select>
          <Button type="submit" disabled={busy} className="w-full sm:w-auto">
            {busy ? "Saving…" : "Save reply"}
          </Button>
        </div>
        <p className="text-xs text-slate-500">
          {ADMIN.ticketEmailFooter} Outbound email uses the same footer.
        </p>
      </form>
    </div>
  );
}
