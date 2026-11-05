import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CLINIC_DEMO_BOOKING_URL,
  clinicDemoBookingUrl,
  googleAppointmentEmbedSrc,
} from "./clinic-demo";

const webRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

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

test("/demo is the short public URL for the clinic booking page", () => {
  const config = readFileSync(join(webRoot, "next.config.ts"), "utf8");
  assert.match(config, /source: "\/demo"/);
  assert.match(config, /destination: "\/clinic-demo"/);
  const banner = readFileSync(join(webRoot, "src/components/fourteen-day-banner.tsx"), "utf8");
  assert.match(banner, /"\/demo"/);
});
