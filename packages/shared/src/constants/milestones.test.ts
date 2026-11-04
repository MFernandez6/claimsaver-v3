import assert from "node:assert/strict";
import test from "node:test";
import { nextOpenMilestone, type CalendarMilestoneLike } from "./milestones";

function event(
  title: string,
  date: string,
  extras: Partial<CalendarMilestoneLike> = {},
): CalendarMilestoneLike {
  return { title, date, completed: false, ...extras };
}

const NOW = new Date("2026-11-04T12:00:00");

test("up next skips the accident date and past reminders", () => {
  const events: CalendarMilestoneLike[] = [
    event("Accident date", "2026-08-12", { description: "[pip:1] accident" }),
    event("14-day treatment window", "2026-08-26", { description: "[pip:2] 14 day" }),
    event("PIP application / notice", "2026-09-11", { description: "[pip:3] notice" }),
    event("Payment / denial (illustrative)", "2026-11-10", { description: "[pip:6] pay" }),
  ];
  const next = nextOpenMilestone(
    events,
    event("Accident date", "2026-08-12", {
      completed: true,
      description: "[pip:1] accident",
    }),
    NOW,
  );
  assert.equal(next?.title, "Payment / denial (illustrative)");
});

test("retired suit-limitation reminders are never up next", () => {
  const events: CalendarMilestoneLike[] = [
    event("Suit limitation (verify)", "2027-08-12", { description: "[pip:7] suit" }),
    event("Payment / denial (illustrative)", "2026-11-10", { description: "[pip:6] pay" }),
  ];
  const next = nextOpenMilestone(events, null, NOW);
  assert.equal(next?.title, "Payment / denial (illustrative)");
});
