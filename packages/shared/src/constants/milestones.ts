export type FloridaPipMilestoneTemplate = {
  id: number;
  dayOffset: number;
  label: string;
  description: string;
  critical: boolean;
};

export const FLORIDA_PIP_MILESTONE_TEMPLATES: FloridaPipMilestoneTemplate[] = [
  {
    id: 1,
    dayOffset: 0,
    label: "Accident date",
    description: "Date of the motor vehicle accident",
    critical: true,
  },
  {
    id: 2,
    dayOffset: 14,
    label: "14-day treatment window",
    description:
      "Florida Statute §627.736 discusses a 14-day period after the accident for certain initial medical services. This date is counted from the accident date you entered. It is not a determination that any visit qualifies in your case.",
    critical: true,
  },
  {
    id: 3,
    dayOffset: 30,
    label: "PIP application / notice",
    description:
      "Florida Statute §627.736 addresses written notice of a covered loss. This reminder is counted from the accident date you entered. Your policy and the statute as applied to your facts control; this is not a determination of what your carrier will accept.",
    critical: true,
  },
  {
    id: 4,
    dayOffset: 35,
    label: "Insurer acknowledgement (illustrative)",
    description:
      "Some carriers send an acknowledgement after they receive notice. Timelines vary. This date is illustrative, not a promise about your file.",
    critical: false,
  },
  {
    id: 5,
    dayOffset: 60,
    label: "Medical bills & records",
    description:
      "PIP files often include bills and treatment records. This date is an organizational reminder so you can store copies in your vault if you choose.",
    critical: true,
  },
  {
    id: 6,
    dayOffset: 90,
    label: "Payment / denial (illustrative)",
    description:
      "Florida Statute §627.736 includes a 30-day payment window after the insurer receives written notice of a covered loss, subject to the statute and your policy. This date is general calendar math from the accident date you entered—not a prediction of payment, denial, or outcome.",
    critical: true,
  },
];

/** Accident date (1) is a fact, not an action. Suit-limitation (7) is retired. */
const SKIP_UP_NEXT_TEMPLATE_IDS = new Set([1, 7]);

/** First YYYY-MM-DD in a date or datetime-local string. */
export function coerceIsoDate(value: string): string {
  const match = String(value || "").trim().match(/^(\d{4}-\d{2}-\d{2})/);
  return match?.[1] ?? "";
}

export function addDays(isoDate: string, days: number): string {
  const day = coerceIsoDate(isoDate);
  if (!day) return "";
  const d = new Date(`${day}T12:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Prefer the official packet date, then accidentDate, then the datetime-local prefix. */
export function normalizeAccidentDate(input: {
  dateOfAccident?: string;
  accidentDate?: string;
  accidentDateTime?: string;
}): string {
  const candidates = [
    coerceIsoDate(input.dateOfAccident || ""),
    coerceIsoDate(input.accidentDate || ""),
    coerceIsoDate(input.accidentDateTime || ""),
  ];
  return candidates.find((v) => v && ISO_DATE.test(v)) || "";
}

export function daysUntil(isoDate: string, from = new Date()): number {
  const target = new Date(`${isoDate}T12:00:00`);
  const start = new Date(from);
  start.setHours(12, 0, 0, 0);
  return Math.round((target.getTime() - start.getTime()) / 86_400_000);
}

export function pipEventMarker(templateId: number) {
  return `[pip:${templateId}]`;
}

export function parsePipTemplateId(description: string): number | null {
  const match = description.match(/^\[pip:(\d+)\]/);
  return match ? Number(match[1]) : null;
}

export function isPipTemplateEvent(event: { description?: string; title?: string }): boolean {
  if (event.description && parsePipTemplateId(event.description) != null) return true;
  return FLORIDA_PIP_MILESTONE_TEMPLATES.some((t) => t.label === event.title);
}

/** Minimal calendar shape for last-done / next-up calculations. */
export type CalendarMilestoneLike = {
  title: string;
  date: string;
  completed: boolean;
  description?: string;
  updatedAt?: string;
  createdAt?: string;
};

export function pipTemplateIdForEvent(event: CalendarMilestoneLike): number | null {
  const fromDescription = parsePipTemplateId(event.description || "");
  if (fromDescription != null) return fromDescription;
  return FLORIDA_PIP_MILESTONE_TEMPLATES.find((t) => t.label === event.title)?.id ?? null;
}

function timestampKey(event: CalendarMilestoneLike) {
  return event.updatedAt || event.createdAt || event.date;
}

/** Most recently marked-done reminder (Done button), not the latest scheduled date. */
export function lastCompletedMilestone(
  events: CalendarMilestoneLike[],
): CalendarMilestoneLike | null {
  const done = events.filter((event) => event.completed);
  if (done.length === 0) return null;
  return [...done].sort((a, b) => timestampKey(b).localeCompare(timestampKey(a)))[0] ?? null;
}

function isUpcomingActionable(event: CalendarMilestoneLike, from = new Date()) {
  const id = pipTemplateIdForEvent(event);
  if (id != null && SKIP_UP_NEXT_TEMPLATE_IDS.has(id)) return false;
  const day = coerceIsoDate(event.date);
  if (!day) return false;
  return daysUntil(day, from) >= 0;
}

/**
 * Next incomplete reminder that is still in the future. Skips the accident-date
 * fact and retired suit-limitation items. After a PIP item, prefers the next
 * PIP template that is still upcoming.
 */
export function nextOpenMilestone(
  events: CalendarMilestoneLike[],
  lastCompleted: CalendarMilestoneLike | null = lastCompletedMilestone(events),
  from = new Date(),
): CalendarMilestoneLike | null {
  const open = events.filter((event) => !event.completed && isUpcomingActionable(event, from));
  if (open.length === 0) return null;

  if (lastCompleted) {
    const lastPipId = pipTemplateIdForEvent(lastCompleted);
    if (lastPipId != null) {
      const followingPip = open
        .map((event) => ({ event, id: pipTemplateIdForEvent(event) }))
        .filter((row) => row.id != null && row.id > lastPipId)
        .sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
      if (followingPip[0]) return followingPip[0].event;
    }
  }

  return (
    [...open].sort((a, b) => {
      const byDate = a.date.localeCompare(b.date);
      if (byDate !== 0) return byDate;
      return (pipTemplateIdForEvent(a) ?? 99) - (pipTemplateIdForEvent(b) ?? 99);
    })[0] ?? null
  );
}

export function calendarMilestonePair(events: CalendarMilestoneLike[]) {
  const lastCompleted = lastCompletedMilestone(events);
  return {
    lastCompleted,
    nextEvent: nextOpenMilestone(events, lastCompleted),
  };
}
