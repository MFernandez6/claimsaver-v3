import assert from "node:assert/strict";
import test from "node:test";
import { CHECKLIST_ITEMS, daysCopy, PAGE_DISCLAIMER } from "./14days";

const FORBIDDEN = [
  /we file/i,
  /we handle your claim/i,
  /get paid/i,
  /maximize/i,
  /guaranteed/i,
  /win your/i,
  /legal advice from us/i,
];

test("campaign copy keeps the user as the filer and includes the disclaimer", () => {
  const blob = JSON.stringify({ daysCopy, CHECKLIST_ITEMS, PAGE_DISCLAIMER });
  for (const pattern of FORBIDDEN) {
    assert.equal(pattern.test(blob), false, `forbidden pattern ${pattern}`);
  }
  assert.match(PAGE_DISCLAIMER.en, /not a law firm/i);
  assert.match(PAGE_DISCLAIMER.en, /does not provide legal advice/i);
  assert.match(PAGE_DISCLAIMER.es, /autoayuda/i);
  assert.equal(CHECKLIST_ITEMS.en.length, 9);
  assert.equal(CHECKLIST_ITEMS.es.length, 9);
  assert.match(CHECKLIST_ITEMS.en[0], /14 days/);
  assert.equal(daysCopy.en.faq.length, 3);
});
