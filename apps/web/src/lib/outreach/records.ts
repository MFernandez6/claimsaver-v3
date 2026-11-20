export const OUTREACH_KINDS = ["clinic", "client", "task", "script", "note", "document"] as const;
export type OutreachKind = (typeof OUTREACH_KINDS)[number];

export const PIPELINE_KINDS = ["clinic", "client"] as const;
export type PipelineKind = (typeof PIPELINE_KINDS)[number];

export const OUTREACH_STAGES = [
  "lead",
  "contacted",
  "visit_scheduled",
  "visited",
  "demo_completed",
  "follow_up",
  "negotiating",
  "converted",
  "lost",
] as const;
export type OutreachStage = (typeof OUTREACH_STAGES)[number];

export const OUTREACH_STAGE_LABELS: Record<OutreachStage, string> = {
  lead: "Lead",
  contacted: "Contacted",
  visit_scheduled: "Visit scheduled",
  visited: "Visited",
  demo_completed: "Demo completed",
  follow_up: "Follow-up",
  negotiating: "Negotiating",
  converted: "Converted",
  lost: "Lost",
};

/** Stages that mean a qualified clinic demonstration already happened (current snapshot, no history table). */
export const DEMO_REACHED_STAGES: readonly OutreachStage[] = [
  "demo_completed",
  "follow_up",
  "negotiating",
  "converted",
];

const LEGACY_STATUS_TO_STAGE: Record<string, OutreachStage> = {
  "New target": "lead",
  Contacted: "contacted",
  Responded: "contacted",
  "Visit scheduled": "visit_scheduled",
  Visited: "visited",
  "In discussion": "negotiating",
  "Partnered / onboarded": "converted",
  "On hold": "follow_up",
  Closed: "lost",
};

const ID_PATTERN = /^[a-z0-9-]{1,80}$/;
const PIPELINE_FIELD_KEYS = new Set([
  "stage",
  "nextActionAt",
  "consentAt",
  "consentSource",
  "next_action_at",
  "consent_at",
  "consent_source",
]);

export type OutreachWrite = {
  id: string;
  kind: OutreachKind;
  fields: Record<string, string>;
  stage: OutreachStage | null;
  nextActionAt: string | null;
  consentAt: string | null;
  consentSource: string;
};

export type OutreachParse =
  | { ok: true; id: string; write?: OutreachWrite }
  | { ok: false; status: number; error: string };

export function isOutreachStage(value: unknown): value is OutreachStage {
  return typeof value === "string" && (OUTREACH_STAGES as readonly string[]).includes(value);
}

export function isPipelineKind(value: unknown): value is PipelineKind {
  return value === "clinic" || value === "client";
}

export function mapLegacyStatusToStage(status: string | undefined): OutreachStage | null {
  if (!status) return null;
  return LEGACY_STATUS_TO_STAGE[status] ?? (isOutreachStage(status) ? status : null);
}

export function resolveOutreachStage(input: {
  kind: string;
  stage?: unknown;
  status?: unknown;
}): OutreachStage | null {
  if (isOutreachStage(input.stage)) return input.stage;
  if (typeof input.status === "string") {
    const mapped = mapLegacyStatusToStage(input.status);
    if (mapped) return mapped;
  }
  if (isPipelineKind(input.kind)) return "lead";
  return null;
}

function optionalTimestamp(value: unknown): string | null | { error: string } {
  if (value == null || value === "") return null;
  if (typeof value !== "string") return { error: "Enter a valid date." };
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return `${trimmed}T12:00:00.000Z`;
  const parsed = Date.parse(trimmed);
  if (!Number.isFinite(parsed)) return { error: "Enter a valid date." };
  return new Date(parsed).toISOString();
}

function nextActionFromFields(fields: Record<string, unknown>): string | null | { error: string } {
  const explicit = optionalTimestamp(fields.nextActionAt ?? fields.next_action_at);
  if (explicit && typeof explicit === "object") return explicit;
  if (explicit) return explicit;
  const due = optionalTimestamp(fields.due);
  if (due && typeof due === "object") return due;
  if (due) return due;
  const visit = optionalTimestamp(fields.visit);
  if (visit && typeof visit === "object") return visit;
  return visit;
}

export function parseOutreachBody(raw: string, method: "PUT" | "DELETE"): OutreachParse {
  if (raw.length > 16000) return { ok: false, status: 413, error: "This record is too long." };
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return { ok: false, status: 400, error: "Invalid record." };
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, status: 400, error: "Invalid record." };
  }
  const record = body as Record<string, unknown>;
  if (typeof record.id !== "string" || !ID_PATTERN.test(record.id)) {
    return { ok: false, status: 400, error: "Invalid record ID." };
  }
  if (method === "DELETE") return { ok: true, id: record.id };
  const { id, kind, ...fields } = record;
  if (typeof kind !== "string" || !OUTREACH_KINDS.includes(kind as OutreachKind)) {
    return { ok: false, status: 400, error: "Enter a valid title and record type." };
  }
  if (typeof fields.title !== "string" || !fields.title.trim()) {
    return { ok: false, status: 400, error: "Enter a valid title and record type." };
  }
  const textFields: Record<string, string> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (PIPELINE_FIELD_KEYS.has(key)) continue;
    if (typeof value !== "string") {
      return { ok: false, status: 400, error: "Enter a valid title and record type." };
    }
    textFields[key] = value;
  }
  textFields.title = textFields.title.trim();
  if (textFields.batch) textFields.batch = textFields.batch.trim();

  if (
    fields.stage != null &&
    fields.stage !== "" &&
    !isOutreachStage(fields.stage)
  ) {
    return { ok: false, status: 400, error: "Choose a pipeline stage." };
  }
  const stage = resolveOutreachStage({
    kind,
    stage: fields.stage,
    status: textFields.status,
  });
  if (isPipelineKind(kind) && !stage) {
    return { ok: false, status: 400, error: "Choose a pipeline stage." };
  }
  if (stage && !isPipelineKind(kind)) {
    return { ok: false, status: 400, error: "Pipeline stages are for clinic and client records." };
  }

  const nextActionAt = nextActionFromFields(fields);
  if (nextActionAt && typeof nextActionAt === "object") {
    return { ok: false, status: 400, error: nextActionAt.error };
  }
  const consentAt = optionalTimestamp(fields.consentAt ?? fields.consent_at);
  if (consentAt && typeof consentAt === "object") {
    return { ok: false, status: 400, error: consentAt.error };
  }
  const consentSource =
    typeof fields.consentSource === "string"
      ? fields.consentSource.trim().slice(0, 80)
      : typeof fields.consent_source === "string"
        ? fields.consent_source.trim().slice(0, 80)
        : "";

  return {
    ok: true,
    id,
    write: {
      id,
      kind: kind as OutreachKind,
      fields: textFields,
      stage: isPipelineKind(kind) ? stage : null,
      nextActionAt,
      consentAt,
      consentSource,
    },
  };
}
