"use client";

import { useEffect, useState } from "react";
import { webApi } from "@/lib/api/client";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/page-header";

type EventRow = {
  id: string;
  actorEmail: string;
  actorRole: string | null;
  action: string;
  resourceType: string;
  resourceId: string;
  createdAt: string;
  ip: string;
};

export default function AdminAuditPage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    webApi
      .get<{ events: EventRow[] }>("/api/v1/admin/audit")
      .then((data) => setEvents(data.events))
      .catch((e) => setError(e instanceof Error ? e.message : "Forbidden"));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-8">
      <AdminPageHeader
        kicker="OWNER"
        title="Audit log"
        description="Append-only. Metadata never includes worksheets, notes, or SSN."
      />
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <div className="space-y-2">
        {events.map((event) => (
          <Card key={event.id}>
            <CardContent className="py-3 text-sm">
              <p className="font-medium text-slate-900">{event.action}</p>
              <p className="break-words text-slate-500">
                {event.actorEmail} ({event.actorRole ?? "—"}) · {event.resourceType}{" "}
                {event.resourceId ? `· ${event.resourceId.slice(0, 8)}…` : ""} ·{" "}
                {new Date(event.createdAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
        {events.length === 0 && !error ? (
          <p className="text-sm text-slate-500">No events yet.</p>
        ) : null}
      </div>
    </div>
  );
}
