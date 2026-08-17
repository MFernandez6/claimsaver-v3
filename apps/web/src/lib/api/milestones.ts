import type { SupabaseClient } from "@supabase/supabase-js";
import {
  FLORIDA_PIP_MILESTONE_TEMPLATES,
  addDays,
  parsePipTemplateId,
  pipEventMarker,
} from "@claimsaver/shared";

const EDUCATION = "General information, not legal advice.";

export async function syncPipDeadlineChain(
  admin: SupabaseClient,
  userId: string,
  claimId: string,
  accidentDate: string,
) {
  if (!accidentDate) return;

  const { data: existing, error } = await admin
    .from("calendar_events")
    .select("id, title, date, description")
    .eq("claim_id", claimId)
    .eq("user_id", userId);

  if (error) return;

  const rows = existing ?? [];

  for (const milestone of FLORIDA_PIP_MILESTONE_TEMPLATES) {
    const date = addDays(accidentDate, milestone.dayOffset);
    const description = `${pipEventMarker(milestone.id)} ${milestone.description} ${EDUCATION}`;
    const found = rows.find(
      (row) =>
        parsePipTemplateId(String(row.description ?? "")) === milestone.id ||
        row.title === milestone.label,
    );

    if (found) {
      if (found.date !== date || found.title !== milestone.label) {
        await admin
          .from("calendar_events")
          .update({
            title: milestone.label,
            date,
            description,
            type: "deadline",
            priority: milestone.critical ? "high" : "medium",
            updated_at: new Date().toISOString(),
          })
          .eq("id", found.id)
          .eq("user_id", userId);
      }
      continue;
    }

    await admin.from("calendar_events").insert({
      user_id: userId,
      claim_id: claimId,
      title: milestone.label,
      date,
      time: "",
      type: "deadline",
      description,
      priority: milestone.critical ? "high" : "medium",
      completed: false,
    });
  }
}

/** @deprecated use syncPipDeadlineChain */
export const maybeSeedMilestones = async (
  admin: SupabaseClient,
  userId: string,
  claimId: string,
  _prevAccident: string,
  nextAccident: string,
) => syncPipDeadlineChain(admin, userId, claimId, nextAccident);
