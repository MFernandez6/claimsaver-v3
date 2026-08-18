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
      "Initial medical treatment often must begin within 14 days for full PIP eligibility—confirm timing with your policy and a licensed professional if unsure.",
    critical: true,
  },
  {
    id: 3,
    dayOffset: 30,
    label: "PIP application / notice",
    description:
      "Written notice of claim to your insurer—timing varies; track your carrier’s requirements.",
    critical: true,
  },
  {
    id: 4,
    dayOffset: 35,
    label: "Insurer acknowledgement (illustrative)",
    description:
      "Many carriers acknowledge within days of notice—your adjuster’s timeline may differ.",
    critical: false,
  },
  {
    id: 5,
    dayOffset: 60,
    label: "Medical bills & records",
    description:
      "Gather and submit bills and related records as treatment progresses.",
    critical: true,
  },
  {
    id: 6,
    dayOffset: 90,
    label: "Payment / denial (illustrative)",
    description:
      "Insurer processing timelines vary after bills are received—follow up on outstanding items.",
    critical: true,
  },
  {
    id: 7,
    dayOffset: 365,
    label: "Suit limitation (verify)",
    description:
      "Statutes of limitation are fact-specific—consult a licensed attorney about any suit deadline.",
    critical: false,
  },
];

export function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T12:00:00`);
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
    input.dateOfAccident,
    input.accidentDate,
    (input.accidentDateTime || "").slice(0, 10),
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

/**
 * Next incomplete reminder on the list: after a PIP item, the following PIP
 * template; otherwise the earliest open date.
 */
export function nextOpenMilestone(
  events: CalendarMilestoneLike[],
  lastCompleted: CalendarMilestoneLike | null = lastCompletedMilestone(events),
): CalendarMilestoneLike | null {
  const open = events.filter((event) => !event.completed);
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
