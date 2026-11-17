export const OUTREACH_KINDS = ["clinic", "client", "task", "script", "note", "document"] as const;

const ID_PATTERN = /^[a-z0-9-]{1,80}$/;

export type OutreachWrite = {
  id: string;
  kind: (typeof OUTREACH_KINDS)[number];
  fields: Record<string, string>;
};

export type OutreachParse =
  | { ok: true; id: string; write?: OutreachWrite }
  | { ok: false; status: number; error: string };

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
  if (typeof kind !== "string" || !OUTREACH_KINDS.includes(kind as OutreachWrite["kind"])) {
    return { ok: false, status: 400, error: "Enter a valid title and record type." };
  }
  if (typeof fields.title !== "string" || !fields.title.trim()) {
    return { ok: false, status: 400, error: "Enter a valid title and record type." };
  }
  if (Object.values(fields).some((value) => typeof value !== "string")) {
    return { ok: false, status: 400, error: "Enter a valid title and record type." };
  }
  const textFields = fields as Record<string, string>;
  textFields.title = textFields.title.trim();
  if (textFields.batch) textFields.batch = textFields.batch.trim();
  return {
    ok: true,
    id,
    write: { id, kind: kind as OutreachWrite["kind"], fields: textFields },
  };
}
