import { SUPPORT_EMAIL } from "@claimsaver/shared";

/** Google Calendar appointment schedule (calendar.app.google/… or appointments/schedules/…). */
export function clinicDemoBookingUrl() {
  return (process.env.NEXT_PUBLIC_CLINIC_DEMO_BOOKING_URL || "").trim();
}

/** Invite-us event if no booking page is configured yet. Opens the visitor's Google Calendar. */
export function clinicDemoCalendarInviteUrl() {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "ClaimSaver+ clinic demo (15 min)",
    details:
      "15-minute walkthrough of ClaimSaver+ for a Florida PIP clinic. Patients stay the filer and still pay $500 for platform access. Clinic staff see checklist progress only — never worksheets or medical details.",
    location: "Google Meet",
    add: SUPPORT_EMAIL,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function googleAppointmentEmbedSrc(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "calendar.google.com" && parsed.pathname.includes("/appointments/schedules/")) {
      parsed.searchParams.set("gv", "true");
      return parsed.toString();
    }
  } catch {
    return null;
  }
  return null;
}
