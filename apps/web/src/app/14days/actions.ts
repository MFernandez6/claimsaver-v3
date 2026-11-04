"use server";

import { submitLead14Days as submit } from "@/lib/14days/submit";
import type { SubmitLeadState } from "@/lib/14days/types";

export async function submitLead14Days(prev: SubmitLeadState, formData: FormData): Promise<SubmitLeadState> {
  return submit(prev, formData);
}
