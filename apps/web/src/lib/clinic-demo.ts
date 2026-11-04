/** Public Google Calendar appointment schedule for the 15-minute clinic demo. */
export const CLINIC_DEMO_BOOKING_URL = "https://calendar.app.google/obrSBdpVtAjhj4rG9";

const CLINIC_DEMO_SCHEDULE_ID =
  "AcZssZ1i8tUsa8QL19ToVoGQm9fSXHHUCNikqt6crIVVd7N6b9flb0WaA7RGrE5SUoFc0UGxFNiz6G33";

export function clinicDemoBookingUrl() {
  return (process.env.NEXT_PUBLIC_CLINIC_DEMO_BOOKING_URL || CLINIC_DEMO_BOOKING_URL).trim();
}

export function googleAppointmentEmbedSrc(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "calendar.app.google") {
      return `https://calendar.google.com/calendar/appointments/schedules/${CLINIC_DEMO_SCHEDULE_ID}?gv=true`;
    }
    if (host === "calendar.google.com" && parsed.pathname.includes("/appointments/schedules/")) {
      parsed.searchParams.set("gv", "true");
      return parsed.toString();
    }
  } catch {
    return null;
  }
  return null;
}
