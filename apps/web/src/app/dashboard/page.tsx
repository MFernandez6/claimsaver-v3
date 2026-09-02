"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  type CalendarEvent,
  type ClaimSummary,
  type DocumentRow,
  type ExpenseRow,
  type Me,
  TOTAL_WORKSHEET_STEPS,
  WORKSHEET_STEPS,
  calendarMilestonePair,
  isPipTemplateEvent,
  parsePipTemplateId,
} from "@claimsaver/shared";
import { ApiClientError } from "@claimsaver/shared";
import { DashboardOverviewPanels } from "@/components/dashboard-overview-panels";
import { NotFilingYet } from "@/components/not-filing-yet";
import { PipDeadlineBanner } from "@/components/pip-deadline-banner";
import { PipDeadlineChain } from "@/components/pip-deadline-chain";
import { SceneCapture } from "@/components/scene-capture";
import { FlashNotice } from "@/components/flash-notice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { webApi } from "@/lib/api/client";
import { useSupabaseUser } from "@/components/auth/use-supabase-user";
import { greetingName } from "@/lib/auth/display-name";
import { useTranslation } from "react-i18next";
import { formatUsd, formatDisplayDate, cn } from "@/lib/utils";
import { LegalReaccept } from "@/components/legal-reaccept";

type Tab = "claims" | "docs" | "calendar" | "expenses";

function eventDisplayTitle(
  event: { title: string; description?: string },
  translate: (key: string, options?: { defaultValue?: string }) => string,
) {
  const id = parsePipTemplateId(event.description || "");
  if (id != null) {
    return translate(`deadlines.templates.${id}.label`, { defaultValue: event.title });
  }
  return event.title;
}

function eventsForClaim(events: CalendarEvent[], claimId: string, isPrimary: boolean) {
  return events.filter((event) => event.claimId === claimId || (isPrimary && !event.claimId));
}

function docsForClaim(docs: DocumentRow[], claimId: string, isPrimary: boolean) {
  return docs.filter((doc) => doc.claimId === claimId || (isPrimary && !doc.claimId));
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useSupabaseUser();
  const [me, setMe] = useState<Me | null>(null);
  const [paywall, setPaywall] = useState(false);
  const [tab, setTab] = useState<Tab>("claims");
  const [claims, setClaims] = useState<ClaimSummary[]>([]);
  const [docs, setDocs] = useState<DocumentRow[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
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
  }, [t]);

  useEffect(() => {
    if (paywall) return;
    void refresh();
    const tick = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    const id = window.setInterval(tick, 10_000);
    window.addEventListener("focus", tick);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", tick);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [refresh, paywall]);

  const toggleEventCompleted = useCallback(
    async (event: CalendarEvent) => {
      const next = !event.completed;
      setEvents((prev) =>
        prev.map((row) =>
          row.id === event.id
            ? { ...row, completed: next, updatedAt: new Date().toISOString() }
            : row,
        ),
      );
      try {
        await webApi.patch(`/api/v1/calendar/${event.id}`, { completed: next });
      } catch {
        await refresh();
      }
    },
    [refresh],
  );

  const milestones = useMemo(() => calendarMilestonePair(events), [events]);

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
  const welcomeName = greetingName(me, user, t("dashboard.there"));
  const lastCompleted = milestones.lastCompleted
    ? {
        title: eventDisplayTitle(milestones.lastCompleted, t),
        dateLabel: t("dashboard.milestone.markedOn", {
          date: formatDisplayDate(milestones.lastCompleted.date) || milestones.lastCompleted.date,
        }),
      }
    : null;
  const nextEvent = milestones.nextEvent
    ? {
        title: eventDisplayTitle(milestones.nextEvent, t),
        dateLabel: formatDisplayDate(milestones.nextEvent.date) || milestones.nextEvent.date,
      }
    : null;

  async function requestDeletion() {
    try {
      await webApi.post("/api/v1/account/deletion-request", {});
      setError(null);
      window.alert(t("legal.deletionRequested"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("legal.deletionFailed"));
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      {me && me.legalConsentCurrent === false ? (
        <LegalReaccept onAccepted={() => void refresh()} />
      ) : null}
      <DashboardOverviewPanels
        currentStep={primary?.worksheetStep ?? 1}
        totalSteps={TOTAL_WORKSHEET_STEPS}
        worksheetComplete={Boolean(primary?.worksheetComplete)}
        documentsCount={docs.length}
        calendarCount={events.length}
        expensesCount={expenses.length}
        lastCompleted={lastCompleted}
        nextEvent={nextEvent}
        welcomeName={welcomeName}
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

      <div className="mt-8 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {(["claims", "docs", "calendar", "expenses"] as Tab[]).map((tabKey) => (
            <Button
              key={tabKey}
              variant={tab === tabKey ? "default" : "outline"}
              onClick={() => setTab(tabKey)}
              className="min-h-11 w-full justify-center sm:w-auto"
            >
              {tabKey === "claims" ? t("dashboard.tabClaims") : tabKey === "docs" ? t("dashboard.tabDocs") : tabKey === "calendar" ? t("dashboard.tabCalendar") : t("dashboard.tabExpenses")}
            </Button>
          ))}
        </div>
        <Button asChild className="min-h-11 w-full bg-gradient-to-r from-emerald-600 to-teal-800 sm:w-auto sm:self-start">
          <Link href="/claim-form">{t("dashboard.openWorksheet")}</Link>
        </Button>
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      <p className="mt-8 text-center text-xs text-slate-500">
        <button type="button" className="underline underline-offset-2" onClick={() => void requestDeletion()}>
          {t("legal.requestDeletion")}
        </button>
      </p>

      {tab === "claims" && (
        <div className="mt-6 space-y-3">
          {claims.length === 0 ? (
            <p className="text-slate-500">{t("dashboard.noClaims")}</p>
          ) : (
            claims.map((c, index) => (
              <ClaimRecordCard
                key={c.id}
                claim={c}
                events={eventsForClaim(events, c.id, index === 0)}
                documentsCount={docsForClaim(docs, c.id, index === 0).length}
              />
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
            onToggleCompleted={toggleEventCompleted}
          />
          <CalendarPanel
            events={events.filter((e) => !isPipTemplateEvent(e))}
            claimId={primary?.id ?? null}
            onChange={refresh}
            onToggleCompleted={toggleEventCompleted}
          />
        </div>
      )}
      {tab === "expenses" && <ExpensesPanel expenses={expenses} onChange={refresh} />}
    </div>
  );
}

function ClaimRecordCard({
  claim,
  events,
  documentsCount,
}: {
  claim: ClaimSummary;
  events: CalendarEvent[];
  documentsCount: number;
}) {
  const { t } = useTranslation();
  const pair = calendarMilestonePair(events);
  const current = Math.min(Math.max(1, claim.worksheetStep || 1), TOTAL_WORKSHEET_STEPS);
  const complete = Boolean(claim.worksheetComplete);
  const stepMeta = WORKSHEET_STEPS.find((step) => step.step === current);
  const stepTitle = stepMeta ? t(`claimForm.worksheetSteps.${stepMeta.key}`) : "";
  const lastTitle = pair.lastCompleted
    ? eventDisplayTitle(pair.lastCompleted, t)
    : null;
  const nextTitle = pair.nextEvent ? eventDisplayTitle(pair.nextEvent, t) : null;
  const worksheetPct = complete ? 100 : Math.round(((current - 1) / TOTAL_WORKSHEET_STEPS) * 100);

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-slate-900 dark:text-white">{claim.claimNumber}</p>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                  complete || claim.status === "completed" || claim.status === "approved"
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200"
                    : claim.status === "rejected"
                      ? "bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-200"
                      : claim.status === "pending" || claim.status === "reviewing"
                        ? "bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
                        : "bg-teal-50 text-teal-800 dark:bg-teal-950/50 dark:text-teal-200",
                )}
              >
                {complete
                  ? t("dashboard.claimCard.completeBadge")
                  : t(`dashboard.claimStatus.${claim.status}`, { defaultValue: claim.status })}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {claim.claimantName || t("dashboard.untitled")}
              {" · "}
              {formatDisplayDate(claim.accidentDate) || t("dashboard.noAccidentDate")}
            </p>
            <p className="mt-1 text-xs text-slate-400">{t("dashboard.internalIdNote")}</p>
          </div>
          <Button asChild variant="outline" className="min-h-11 w-full sm:w-auto">
            <Link href="/claim-form">{complete ? t("dashboard.progress.review") : t("dashboard.continue")}</Link>
          </Button>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
            <p className="font-medium text-slate-700 dark:text-slate-200">
              {complete
                ? t("dashboard.claimCard.worksheetDone", { total: TOTAL_WORKSHEET_STEPS })
                : t("dashboard.claimCard.worksheet", { current, total: TOTAL_WORKSHEET_STEPS })}
            </p>
            <p className="tabular-nums text-teal-700 dark:text-teal-300">{worksheetPct}%</p>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 transition-[width] duration-500"
              style={{ width: `${worksheetPct}%` }}
            />
          </div>
          {complete ? (
            <p className="mt-1.5 text-xs text-slate-500">{t("dashboard.claimCard.savedHint")}</p>
          ) : stepTitle ? (
            <p className="mt-1.5 text-xs text-slate-500">
              {t("dashboard.claimCard.currentStep", { title: stepTitle })}
            </p>
          ) : null}
        </div>

        <dl className="grid gap-2 text-xs sm:grid-cols-2">
          <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
            <dt className="font-medium uppercase tracking-wide text-slate-500">
              {t("dashboard.milestone.lastDone")}
            </dt>
            <dd className="mt-0.5 text-slate-800 dark:text-slate-100">
              {lastTitle
                ? t("dashboard.claimCard.lastDoneDetail", {
                    title: lastTitle,
                    date: formatDisplayDate(pair.lastCompleted?.date) || pair.lastCompleted?.date || "",
                  })
                : t("dashboard.milestone.noneDone")}
            </dd>
          </div>
          <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
            <dt className="font-medium uppercase tracking-wide text-slate-500">
              {t("dashboard.milestone.upNext")}
            </dt>
            <dd className="mt-0.5 text-slate-800 dark:text-slate-100">
              {nextTitle && pair.nextEvent
                ? t("dashboard.claimCard.nextDetail", {
                    title: nextTitle,
                    date: formatDisplayDate(pair.nextEvent.date) || pair.nextEvent.date,
                  })
                : t("dashboard.milestone.allCaughtUp")}
            </dd>
          </div>
        </dl>
        <p className="text-xs text-slate-500">
          {t("dashboard.overviewDocsCount", { count: documentsCount })}
        </p>
      </CardContent>
    </Card>
  );
}

function DocsPanel({ docs, onChange }: { docs: DocumentRow[]; onChange: () => void }) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("name", file.name);
      form.append("type", "other");
      await webApi.upload("/api/v1/documents", form);
      setNotice(t("dashboard.uploadSuccess", { name: file.name }));
      onChange();
    } catch {
      setError(t("capture.error"));
    } finally {
      setBusy(false);
    }
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
            e.target.value = "";
            if (f) void upload(f);
          }}
        />
      </label>
      <p className="text-xs text-slate-500">{t("dashboard.docsHint")}</p>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
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
                  try {
                    const { url, name } = await webApi.get<{ url: string; name?: string }>(
                      `/api/v1/documents/${d.id}`,
                    );
                    const opened = window.open(url, "_blank", "noopener,noreferrer");
                    if (!opened) {
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = name || d.name;
                      link.rel = "noopener noreferrer";
                      link.target = "_blank";
                      document.body.appendChild(link);
                      link.click();
                      link.remove();
                    }
                  } catch {
                    setError(t("dashboard.docOpenFailed"));
                  }
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
      <FlashNotice message={notice} onDismiss={() => setNotice(null)} />
    </div>
  );
}

function CalendarPanel({
  events,
  claimId,
  onChange,
  onToggleCompleted,
}: {
  events: CalendarEvent[];
  claimId: string | null;
  onChange: () => void;
  onToggleCompleted: (event: CalendarEvent) => void;
}) {
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
              <p className="text-xs text-slate-500">{formatDisplayDate(ev.date) || ev.date} · {ev.type}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => void onToggleCompleted(ev)}
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
  const total = expenses.reduce((s, e) => s + (Number.isFinite(e.amountCents) ? e.amountCents : 0), 0);

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
