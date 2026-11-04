import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { AppRole } from "@/lib/auth/permissions";
import { stripMedicalFields } from "@/lib/auth/mask";

export type AuditInput = {
  actorId?: string | null;
  actorRole?: AppRole | null;
  action: string;
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
};

function sanitizeMetadata(input: Record<string, unknown> | undefined) {
  const stripped = stripMedicalFields(input ?? {});
  const { worksheet, notes, body, ssn, claimantSSN, ...rest } = stripped as Record<
    string,
    unknown
  > & {
    worksheet?: unknown;
    notes?: unknown;
    body?: unknown;
    ssn?: unknown;
    claimantSSN?: unknown;
  };
  void worksheet;
  void notes;
  void body;
  void ssn;
  void claimantSSN;
  return rest;
}

export async function writeAudit(input: AuditInput): Promise<void> {
  try {
    const { error } = await getSupabaseAdmin().from("audit_events").insert({
      actor_id: input.actorId ?? null,
      actor_role: input.actorRole ?? null,
      action: input.action,
      resource_type: input.resourceType ?? "",
      resource_id: input.resourceId ?? "",
      metadata: sanitizeMetadata(input.metadata),
      ip: input.ip ?? "",
      user_agent: (input.userAgent ?? "").slice(0, 300),
    });
    if (error) console.error("audit_events insert failed", error.message);
  } catch (err) {
    console.error("audit_events insert failed", err);
  }
}
