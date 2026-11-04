import assert from "node:assert/strict";
import test from "node:test";
import {
  CLINIC_DEMO_BOOKING_URL,
  clinicDemoBookingUrl,
  googleAppointmentEmbedSrc,
} from "./clinic-demo";

test("clinic demo uses the Google Calendar appointment schedule", () => {
  assert.equal(clinicDemoBookingUrl(), CLINIC_DEMO_BOOKING_URL);
  assert.match(CLINIC_DEMO_BOOKING_URL, /^https:\/\/calendar\.app\.google\//);
});

test("short Google booking links become embeddable iframe sources", () => {
  const src = googleAppointmentEmbedSrc(CLINIC_DEMO_BOOKING_URL);
  assert.match(src ?? "", /calendar\.google\.com\/calendar\/appointments\/schedules\/.+\?gv=true/);
});

test("full appointment schedule URLs keep gv=true for embed", () => {
  const src = googleAppointmentEmbedSrc(
    "https://calendar.google.com/calendar/appointments/schedules/abc123",
  );
  assert.equal(
    src,
    "https://calendar.google.com/calendar/appointments/schedules/abc123?gv=true",
  );
});
