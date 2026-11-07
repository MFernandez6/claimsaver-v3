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
    const full = JSON.parse(readFileSync(join(webRoot, `locales/${lang}.json`), "utf8")) as {
      navigation: { forClinics: string };
      cta: { refundLine: string; stripeLine: string };
      home: {
        faq: { refund: { question: string; answer: string } };
        hero: { urgency: string; trustSpine: string; founderCredential: string };
      };
      pitch: { founderByline: string };
      whoWeAre: {
        founderBackground: {
          initials: string;
          role: string;
          name: string;
          credential1: string;
          credential2: string;
          credential3: string;
          credential6: string;
          adjusterLine: string;
          body: string;
        };
      };
      pricing: {
        offer: { priceLine: string; perFiler: string; noPercentage: string };
        vs: { howOurs: string; howFirm: string; howSub: string };
        fit: { anchorEcho: string };
      };
    };
    if (lang === "en") {
      assert.equal(full.navigation.forClinics, "For Clinics");
    }
    assert.match(full.cta.refundLine, /14/);
    assert.match(full.cta.stripeLine, /Stripe/);
    assert.match(full.home.faq.refund.answer, /Stripe/);
    assert.match(full.home.faq.refund.answer, /14/);
    assert.equal(full.whoWeAre.founderBackground.initials, "MF");
    assert.match(full.whoWeAre.founderBackground.name, /Miguel A\. Fernandez/);
    assert.match(full.whoWeAre.founderBackground.role, /CEO|PDG/);
    assert.match(full.whoWeAre.founderBackground.credential1, /Master of Science in Law and Policy/);
    assert.match(full.whoWeAre.founderBackground.credential2, /Magna Cum Laude/);
    assert.match(full.whoWeAre.founderBackground.credential2, /3\.78/);
    assert.doesNotMatch(full.whoWeAre.founderBackground.credential2, /\(/);
    assert.match(full.whoWeAre.founderBackground.credential3, /Golden Key International Honour Society/);
    assert.match(full.whoWeAre.founderBackground.credential6, /Built in Miami/);
    assert.match(full.whoWeAre.founderBackground.credential6, /Cohort 4/);
    assert.match(full.home.hero.urgency, /14/);
    assert.ok(full.home.hero.trustSpine.length > 8);
    assert.ok(full.home.hero.founderCredential.length > 8);
    assert.ok(full.whoWeAre.founderBackground.adjusterLine.length > 8);
    if (lang === "en") {
      assert.equal(full.home.hero.urgency, "Hurt in a crash? You have 14 days to get treated.");
      assert.equal(full.home.hero.trustSpine, "It's your coverage. You paid for it. Use it.");
      assert.equal(full.home.hero.founderCredential, "Built by a former Florida claims adjuster.");
      assert.equal(full.whoWeAre.founderBackground.adjusterLine, "Built by a former Florida claims adjuster.");
      assert.match(full.whoWeAre.founderBackground.body, /built by a former Florida claims adjuster/i);
      assert.match(full.whoWeAre.founderBackground.body, /Built in Miami accelerator, Cohort 4/);
      assert.match(full.pitch.founderByline, /former Florida claims adjuster/);
    }
    assert.match(full.pricing.offer.priceLine, /\{\{price\}\}/);
    assert.match(full.pricing.offer.perFiler, /filer|reclamante|déposant/i);
    assert.match(full.pricing.offer.noPercentage, /PIP/);
    assert.match(full.pricing.vs.howOurs, /\{\{price\}\}/);
    assert.match(full.pricing.fit.anchorEcho, /\{\{price\}\}/);
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
  assert.doesNotMatch(pricing, /ClinicPricingNote/);
  assert.match(pricing, /href="\/for-clinics"/);
  assert.match(pricing, /TrustCtaNote/);
  assert.doesNotMatch(pricing, /TrustProofSection/);
  assert.match(pricing, /NamedProofSection/);
  assert.match(pricing, /ThirdPartyStrip/);
  assert.match(pricing, /home\.faq\.refund/);
  assert.match(pricing, /PricingOffer/);
  assert.match(pricing, /PricingValueTable/);
  assert.match(pricing, /PATIENT_PRICE_USD/);
  assert.ok(pricing.indexOf("<PricingOffer") < pricing.indexOf("<PricingCheckout"));
  const offer = readFileSync(join(webRoot, "components/pricing-offer.tsx"), "utf8");
  assert.match(offer, /pages\.howItWorks\.include/);
  assert.doesNotMatch(offer, /pricing\.offer\.anchor/);
  assert.match(offer, /data-pricing-offer="platform"/);
  const compare = readFileSync(join(webRoot, "components/pricing-compare.tsx"), "utf8");
  assert.match(compare, /pricing\.fit\.anchorEcho/);
  const how = readFileSync(join(webRoot, "app/how-it-works/page.tsx"), "utf8");
  assert.match(how, /copy\.patientPrice\.short/);
  const clinic = readFileSync(join(webRoot, "app/clinic/page.tsx"), "utf8");
  assert.match(clinic, /copy\.clinic\.visibility/);
  assert.match(clinic, /copy\.clinic\.noReferralFees/);
  const home = readFileSync(join(webRoot, "components/home-page.tsx"), "utf8");
  assert.match(home, /home\.hero\.urgency/);
  assert.match(home, /<h1[\s\S]*home\.hero\.urgency[\s\S]*<\/h1>/);
  assert.match(home, /home\.hero\.trustSpine/);
  assert.match(home, /home\.hero\.founderCredential/);
  assert.match(home, /copy\.patientPrice\.short/);
  assert.match(home, /href="\/clinic-demo"/);
  assert.doesNotMatch(home, /CHECKOUT_PATH/);
  assert.match(home, /cta\.payAccess/);
  assert.match(home, /TrustCtaNote/);
  assert.doesNotMatch(home, /TrustProofSection/);
  assert.match(home, /home\.faq\.refund/);
  assert.doesNotMatch(home, /rear-ended on I-95, filed alone/);
  assert.match(home, /ProductPreview/);
  assert.match(home, /NamedProofSection/);
  assert.match(home, /ThirdPartyStrip/);
  assert.doesNotMatch(home, /LocalizedSocialImage/);
  const proof = readFileSync(join(webRoot, "lib/proof/public-proof.ts"), "utf8");
  assert.match(proof, /FILER_QUOTES: FilerQuote\[\] = \[\]/);
  assert.match(proof, /DATED_THIRD_PARTY: DatedThirdParty\[\] = \[\]/);
  assert.match(proof, /FOUNDER_PHOTO_SRC: string \| null = null/);
  assert.match(proof, /FOUNDER_LINKEDIN_HREF = "https:\/\/www\.linkedin\.com\/in\/miguelfernandez023\/"/);
  const trust = readFileSync(join(webRoot, "components/trust-signals.tsx"), "utf8");
  assert.match(trust, /FOUNDER_LINKEDIN_HREF/);
  assert.match(trust, /whoWeAre\.founderBackground\.linkedin/);
  const signup = readFileSync(join(webRoot, "app/signup/page.tsx"), "utf8");
  assert.match(signup, /autoComplete="email"/);
  assert.match(signup, /autoComplete="new-password"/);
  const nav = readFileSync(join(webRoot, "components/navbar.tsx"), "utf8");
  assert.doesNotMatch(nav, /CHECKOUT_PATH/);
  assert.match(nav, /START_PATH/);
  assert.match(nav, /aria-controls="site-menu"/);
  assert.match(nav, /id="site-menu"/);
  assert.match(nav, /ResizeObserver/);
  assert.match(nav, /setMode\("full"\)/);
  assert.match(nav, /href: "\/for-clinics"/);
  const footer = readFileSync(join(webRoot, "components/footer.tsx"), "utf8");
  assert.doesNotMatch(footer, /CHECKOUT_PATH/);
  assert.match(footer, /START_PATH/);
  assert.match(footer, /cta\.payAccess/);
  const who = readFileSync(join(webRoot, "app/who-we-are/page.tsx"), "utf8");
  assert.match(who, /founderBackground\.adjusterLine/);
  assert.match(who, /credential6/);
  assert.match(who, /FOUNDER_LINKEDIN_HREF/);
  assert.match(who, /home\.hero\.trustSpine/);
  assert.doesNotMatch(who, /CHECKOUT_PATH/);
  assert.match(who, /START_PATH/);
  assert.match(who, /cta\.payAccess/);
  const howPage = readFileSync(join(webRoot, "app/how-it-works/page.tsx"), "utf8");
  assert.doesNotMatch(howPage, /CHECKOUT_PATH/);
  assert.match(howPage, /START_PATH/);
  assert.match(howPage, /cta\.payAccess/);
  const days = readFileSync(join(webRoot, "content/14days.ts"), "utf8");
  assert.match(days, /clinicsValueProp/);
  assert.match(days, /progress-only view for your front desk/);
});
