"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FLORIDA_PIP_MILESTONE_TEMPLATES,
  addDays,
  daysUntil,
  isPipTemplateEvent,
  parsePipTemplateId,
  type CalendarEvent,
} from "@claimsaver/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { webApi } from "@/lib/api/client";
import { cn } from "@/lib/utils";

export function PipDeadlineChain({
  accidentDate,
  claimId,
  events,
  onChange,
}: {
  accidentDate: string | null;
  claimId: string | null;
  events: CalendarEvent[];
  onChange: () => void;
}) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pipEvents = events.filter(isPipTemplateEvent);

  async function sync() {
    if (!claimId) return;
    setBusy(true);
    setError(null);
    try {
      await webApi.post(`/api/v1/claims/${claimId}/deadlines`, {});
      onChange();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("deadlines.syncFailed"));
    } finally {
      setBusy(false);
    }
  }

  const rows = FLORIDA_PIP_MILESTONE_TEMPLATES.map((template) => {
    const event = pipEvents.find(
      (ev) => parsePipTemplateId(ev.description) === template.id || ev.title === template.label,
    );
    const date = event?.date || (accidentDate ? addDays(accidentDate, template.dayOffset) : "");
    return { template, event, date, remaining: date ? daysUntil(date) : null };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("deadlines.chainTitle")}</CardTitle>
        <p className="text-sm text-slate-500">{t("deadlines.education")}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {!accidentDate ? (
          <p className="text-sm text-slate-500">{t("deadlines.needAccidentDate")}</p>
        ) : (
          <ol className="space-y-3">
            {rows.map(({ template, event, date, remaining }) => (
              <li
                key={template.id}
                className={cn(
                  "flex items-start justify-between gap-3 rounded-xl border px-4 py-3",
                  template.critical
                    ? "border-amber-200 bg-amber-50/70 dark:border-amber-900/50 dark:bg-amber-950/20"
                    : "border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-900/40",
                  event?.completed && "opacity-60",
                )}
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {t(`deadlines.templates.${template.id}.label`, { defaultValue: template.label })}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {date || t("dashboard.noAccidentDate")}
                    {remaining != null
                      ? ` · ${remaining >= 0 ? t("deadlines.daysAway", { n: remaining }) : t("deadlines.daysAgo", { n: Math.abs(remaining) })}`
                      : ""}
                    {template.critical ? ` · ${t("deadlines.critical")}` : ""}
                  </p>
                </div>
                {event ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      await webApi.patch(`/api/v1/calendar/${event.id}`, { completed: !event.completed });
                      onChange();
                    }}
                  >
                    {event.completed ? t("common.undo") : t("common.done")}
                  </Button>
                ) : null}
              </li>
            ))}
          </ol>
        )}
        {claimId && accidentDate ? (
          <Button variant="outline" disabled={busy} onClick={() => void sync()}>
            {busy ? t("common.loading") : pipEvents.length ? t("deadlines.refresh") : t("deadlines.add")}
          </Button>
        ) : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </CardContent>
    </Card>
  );
}
