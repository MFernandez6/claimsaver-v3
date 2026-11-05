import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const webRoot = join(dir, "../..");

function locale(lang: string) {
  return JSON.parse(readFileSync(join(webRoot, `locales/${lang}.json`), "utf8")) as {
    copy: {
      patientPrice: { short: string; sameForReferrals: string };
      clinic: {
        visibility: string;
        noReferralFees: string;
        pricingPilot: string;
        pricingPublic: string;
        pricingKicker: string;
        pricingHeading: string;
        valueProp: string;
      };
      disclaimer: { selfHelp: string };
    };
  };
}

test("canonical pricing constants and i18n keys exist in en/es/fr", () => {
  const copy = readFileSync(join(dir, "pricing.ts"), "utf8");
  assert.match(copy, /PATIENT_PRICE_USD/);
  assert.match(copy, /CLINIC_PRICE_USD_MONTHLY/);
  assert.match(copy, /CLINIC_TIER_PUBLIC = process\.env\.NEXT_PUBLIC_CLINIC_TIER_PUBLIC === "true"/);
  assert.match(copy, /pricingPilot/);
  assert.match(copy, /pricingPublic/);
  for (const lang of ["en", "es", "fr"] as const) {
    const pack = locale(lang);
    assert.match(pack.copy.patientPrice.short, /\{\{price\}\}/);
    assert.match(pack.copy.patientPrice.sameForReferrals, /\{\{price\}\}/);
    assert.ok(pack.copy.clinic.visibility.length > 20);
    assert.ok(pack.copy.clinic.noReferralFees.length > 20);
    assert.match(pack.copy.clinic.pricingPilot, /15/);
    assert.doesNotMatch(pack.copy.clinic.pricingPilot, /\{\{clinicPrice\}\}|299/);
    assert.match(pack.copy.clinic.pricingPublic, /\{\{clinicPrice\}\}/);
    assert.ok(pack.copy.clinic.pricingKicker.length > 4);
    assert.ok(pack.copy.clinic.pricingHeading.length > 4);
    assert.ok(pack.copy.clinic.valueProp.length > 20);
    assert.ok(pack.copy.disclaimer.selfHelp.length > 20);
    assert.doesNotMatch(JSON.stringify(pack.copy), /\$199|199 \$/);
    const terms = JSON.parse(readFileSync(join(webRoot, `locales/${lang}.json`), "utf8")) as {
      legalPages: { terms: { s4Body: string } };
    };
    assert.doesNotMatch(terms.legalPages.terms.s4Body, /\{\{clinicPrice\}\}|299/);
  }
});

test("required surfaces import the canonical copy keys", () => {
  const enroll = readFileSync(join(webRoot, "app/enroll/[code]/enroll-client.tsx"), "utf8");
  assert.match(enroll, /copy\.patientPrice\.sameForReferrals/);
  assert.match(enroll, /copy\.clinic\.visibility/);
  assert.match(enroll, /copy\.disclaimer\.selfHelp/);
  const note = readFileSync(join(webRoot, "components/clinic-pricing-note.tsx"), "utf8");
  assert.match(note, /clinicPricingKey/);
  assert.match(note, /copy\.clinic\.noReferralFees/);
  const demo = readFileSync(join(webRoot, "app/clinic-demo/page.tsx"), "utf8");
  assert.match(demo, /copy\.clinic\.valueProp/);
  assert.match(demo, /ClinicPricingNote/);
  assert.match(demo, /copy\.clinic\.visibility/);
  assert.match(demo, /copy\.patientPrice\.sameForReferrals/);
  const pricing = readFileSync(join(webRoot, "app/pricing/page.tsx"), "utf8");
  assert.match(pricing, /copy\.patientPrice\.short/);
  assert.match(pricing, /ClinicPricingNote/);
  const how = readFileSync(join(webRoot, "app/how-it-works/page.tsx"), "utf8");
  assert.match(how, /copy\.patientPrice\.short/);
  const clinic = readFileSync(join(webRoot, "app/clinic/page.tsx"), "utf8");
  assert.match(clinic, /copy\.clinic\.visibility/);
  assert.match(clinic, /copy\.clinic\.noReferralFees/);
  const home = readFileSync(join(webRoot, "components/home-page.tsx"), "utf8");
  assert.match(home, /copy\.patientPrice\.short/);
  assert.match(home, /href="\/clinic-demo"/);
  const days = readFileSync(join(webRoot, "content/14days.ts"), "utf8");
  assert.match(days, /clinicsValueProp/);
  assert.match(days, /progress-only view for your front desk/);
});
