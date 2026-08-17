"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  type CalendarEvent,
  type ClaimSummary,
  type DocumentRow,
  type ExpenseRow,
  type Me,
  JOURNEY_STEPS,
  isPipTemplateEvent,
} from "@claimsaver/shared";
import { ApiClientError } from "@claimsaver/shared";
import { DashboardOverviewPanels } from "@/components/dashboard-overview-panels";
import { NotFilingYet } from "@/components/not-filing-yet";
import { PipDeadlineBanner } from "@/components/pip-deadline-banner";
import { PipDeadlineChain } from "@/components/pip-deadline-chain";
import { SceneCapture } from "@/components/scene-capture";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { webApi } from "@/lib/api/client";
import { useTranslation } from "react-i18next";
import { formatUsd } from "@/lib/utils";

type Tab = "claims" | "docs" | "calendar" | "expenses";

export default function DashboardPage() {
  const { t } = useTranslation();
  const [me, setMe] = useState<Me | null>(null);
  const [paywall, setPaywall] = useState(false);
  const [tab, setTab] = useState<Tab>("claims");
  const [claims, setClaims] = useState<ClaimSummary[]>([]);
  const [docs, setDocs] = useState<DocumentRow[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      const profile = await webApi.get<Me>("/api/v1/me");
      setMe(profile);
      if (!profile.hasPlatformAccess) {
        setPaywall(true);
        return;
      }
      const [c, d, e, x] = await Promise.all([
        webApi.get<ClaimSummary[]>("/api/v1/claims"),
        webApi.get<DocumentRow[]>("/api/v1/documents"),
        webApi.get<CalendarEvent[]>("/api/v1/calendar"),
        webApi.get<ExpenseRow[]>("/api/v1/expenses"),
      ]);
      setClaims(c);
      setDocs(d);
      setEvents(e);
      setExpenses(x);
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 402) {
        setPaywall(true);
        return;
      }
      setError(err instanceof Error ? err.message : t("dashboard.loadFailed"));
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  const nextEvent = useMemo(() => {
    const upcoming = events.filter((e) => !e.completed).sort((a, b) => a.date.localeCompare(b.date))[0];
    return upcoming ? { title: upcoming.title, dateLabel: upcoming.date } : null;
  }, [events]);

  if (paywall) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">{t("dashboard.unlockTitle")}</h1>
        <p className="mt-3 text-slate-600">
          {t("dashboard.unlockBody")}
        </p>
        <Button asChild className="mt-6 bg-gradient-to-r from-emerald-600 to-teal-800">
          <Link href="/pricing">{t("common.goToCheckout")}</Link>
        </Button>
      </div>
    );
  }

  const primary = claims[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <DashboardOverviewPanels
        completedSteps={primary?.worksheetStep ?? 0}
        totalSteps={8}
        documentsCount={docs.length}
        nextEvent={nextEvent}
        welcomeName={me?.firstName || me?.email || t("dashboard.there")}
      />

      <div className="mt-6">
        <NotFilingYet />
      </div>
      {primary?.accidentDate ? (
        <div className="mt-4">
          <PipDeadlineBanner accidentDate={primary.accidentDate} />
        </div>
      ) : null}

      <div className="mt-6">
        <SceneCapture onUploaded={() => void refresh()} />
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{t("dashboard.journeyTitle")}</CardTitle>
          <p className="text-sm text-slate-500">{t("dashboard.journeySubtitle")}</p>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {JOURNEY_STEPS.map((s) => (
            <div key={s.id} className="rounded-lg border p-3">
              <p className="font-medium">{s.id}. {t(`dashboard.journey.${s.id}title`)}</p>
              <p className="text-xs text-slate-500">{t(`dashboard.journey.${s.id}note`)}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="mt-8 flex flex-wrap gap-2">
        {(["claims", "docs", "calendar", "expenses"] as Tab[]).map((tabKey) => (
          <Button key={tabKey} variant={tab === tabKey ? "default" : "outline"} onClick={() => setTab(tabKey)}>
            {tabKey === "claims" ? t("dashboard.tabClaims") : tabKey === "docs" ? t("dashboard.tabDocs") : tabKey === "calendar" ? t("dashboard.tabCalendar") : t("dashboard.tabExpenses")}
          </Button>
        ))}
        <Button asChild className="ml-auto bg-gradient-to-r from-emerald-600 to-teal-800">
          <Link href="/claim-form">{t("dashboard.openWorksheet")}</Link>
        </Button>
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      {tab === "claims" && (
        <div className="mt-6 space-y-3">
          {claims.length === 0 ? (
            <p className="text-slate-500">{t("dashboard.noClaims")}</p>
          ) : (
            claims.map((c) => (
              <Card key={c.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
                  <div>
                    <p className="font-semibold">{c.claimNumber}</p>
                    <p className="text-sm text-slate-500">
                      {c.claimantName || t("dashboard.untitled")} · {c.accidentDate || t("dashboard.noAccidentDate")} · {c.status}
                    </p>
                    <p className="text-xs text-slate-400">{t("dashboard.internalIdNote")}</p>
                  </div>
                  <Button asChild variant="outline"><Link href="/claim-form">{t("dashboard.continue")}</Link></Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {tab === "docs" && <DocsPanel docs={docs} onChange={refresh} />}
      {tab === "calendar" && (
        <div className="mt-6 space-y-6">
          <PipDeadlineChain
            accidentDate={primary?.accidentDate ?? null}
            claimId={primary?.id ?? null}
            events={events}
            onChange={() => void refresh()}
          />
          <CalendarPanel events={events.filter((e) => !isPipTemplateEvent(e))} claimId={primary?.id ?? null} onChange={refresh} />
        </div>
      )}
      {tab === "expenses" && <ExpensesPanel expenses={expenses} onChange={refresh} />}
    </div>
  );
}

function DocsPanel({ docs, onChange }: { docs: DocumentRow[]; onChange: () => void }) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);

  async function upload(file: File) {
    setBusy(true);
    const form = new FormData();
    form.append("file", file);
    form.append("name", file.name);
    form.append("type", "other");
    await webApi.upload("/api/v1/documents", form);
    setBusy(false);
    onChange();
  }

  return (
    <div className="mt-6 space-y-4">
      <label className="inline-flex cursor-pointer items-center rounded-lg border px-4 py-2 text-sm">
        {busy ? t("dashboard.uploading") : t("dashboard.uploadFile")}
        <input
          type="file"
          accept="image/*,.pdf,.heic,.jpg,.jpeg,.png"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void upload(f);
          }}
        />
      </label>
      <p className="text-xs text-slate-500">{t("dashboard.docsHint")}</p>
      {docs.map((d) => (
        <Card key={d.id}>
          <CardContent className="flex items-center justify-between gap-3 pt-6">
            <div>
              <p className="font-medium">{d.name}</p>
              <p className="text-xs text-slate-500">{d.type} · {(d.sizeBytes / 1024).toFixed(0)} KB</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  const { url } = await webApi.get<{ url: string }>(`/api/v1/documents/${d.id}`);
                  window.open(url, "_blank");
                }}
              >
                {t("common.open")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  await webApi.delete(`/api/v1/documents/${d.id}`);
                  onChange();
                }}
              >
                {t("common.delete")}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CalendarPanel({ events, claimId, onChange }: { events: CalendarEvent[]; claimId: string | null; onChange: () => void }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  return (
    <div className="mt-6 space-y-4">
      <form
        className="flex flex-wrap gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          await webApi.post("/api/v1/calendar", {
            title,
            date,
            type: "custom",
            priority: "medium",
            claimId: claimId ?? undefined,
          });
          setTitle("");
          onChange();
        }}
      >
        <Input placeholder={t("dashboard.reminderTitle")} value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <Button type="submit">{t("common.add")}</Button>
      </form>
      <p className="text-xs text-slate-500">
        {t("dashboard.calendarHint")}
      </p>
      {events.map((ev) => (
        <Card key={ev.id}>
          <CardContent className="flex items-center justify-between gap-3 pt-6">
            <div>
              <p className={ev.completed ? "line-through text-slate-400" : "font-medium"}>{ev.title}</p>
              <p className="text-xs text-slate-500">{ev.date} · {ev.type}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                await webApi.patch(`/api/v1/calendar/${ev.id}`, { completed: !ev.completed });
                onChange();
              }}
            >
              {ev.completed ? t("common.undo") : t("common.done")}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ExpensesPanel({ expenses, onChange }: { expenses: ExpenseRow[]; onChange: () => void }) {
  const { t } = useTranslation();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [incurredOn, setIncurredOn] = useState("");
  const total = expenses.reduce((s, e) => s + e.amountCents, 0);

  return (
    <div className="mt-6 space-y-4">
      <p className="text-sm text-slate-600">{t("dashboard.expenseIntro", { total: formatUsd(total) })}</p>
      <form
        className="flex flex-wrap gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          await webApi.post("/api/v1/expenses", {
            category: "other",
            amountCents: Math.round(Number(amount) * 100),
            description,
            incurredOn,
          });
          setDescription("");
          setAmount("");
          onChange();
        }}
      >
        <Input placeholder={t("dashboard.description")} value={description} onChange={(e) => setDescription(e.target.value)} required />
        <Input placeholder={t("dashboard.amountUsd")} type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <Input type="date" value={incurredOn} onChange={(e) => setIncurredOn(e.target.value)} required />
        <Button type="submit">{t("dashboard.logExpense")}</Button>
      </form>
      {expenses.map((ex) => (
        <Card key={ex.id}>
          <CardContent className="flex items-center justify-between pt-6">
            <div>
              <p className="font-medium">{ex.description}</p>
              <p className="text-xs text-slate-500">{ex.incurredOn} · {ex.category}</p>
            </div>
            <p className="font-semibold">{formatUsd(ex.amountCents)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
