import assert from "node:assert/strict";
import test from "node:test";
import { clinicDemoCalendarInviteUrl, googleAppointmentEmbedSrc } from "./clinic-demo";

test("Google Calendar invite opens an event template to support@", () => {
  const url = clinicDemoCalendarInviteUrl();
  assert.match(url, /^https:\/\/calendar\.google\.com\/calendar\/render\?/);
  assert.match(url, /action=TEMPLATE/);
  assert.match(url, /add=support%40claimsaverplus\.com/);
  assert.match(url, /15-minute|15 min/);
});

test("appointment schedule URLs become embeddable iframe sources", () => {
  const src = googleAppointmentEmbedSrc(
    "https://calendar.google.com/calendar/appointments/schedules/abc123",
  );
  assert.equal(
    src,
    "https://calendar.google.com/calendar/appointments/schedules/abc123?gv=true",
  );
  assert.equal(googleAppointmentEmbedSrc("https://calendar.app.google/short"), null);
});
