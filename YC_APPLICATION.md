# ClaimSaver+ — Y Combinator application draft

Use this as a working draft. Replace bracketed metrics with real numbers before submit. Do not claim legal services, recoveries, or “we handle claims.”

**Company:** ClaimSaver+  
**Location:** Miami, Florida  
**Site:** https://www.claimsaverplus.com  
**One-liner:** File your Florida no-fault claim. Keep what’s yours.

---

## Describe what your company does

Florida is a no-fault state. After a crash, your own PIP coverage is supposed to pay medical bills and lost wages fast, without arguing about fault. In practice it often doesn’t: a hard 14-day initial treatment window can limit PIP medical benefits, carriers use paperwork to delay or deny, and the system is built for insurance professionals—not someone rear-ended on the Palmetto.

Claimants face two bad options: file it themselves and risk a missed deadline or a technical error, or hire a PI attorney who takes about a third of the recovery for what is often a routine, undisputed no-fault filing.

ClaimSaver+ is the guided middle path: software that walks a claimant through preparing their own PIP materials, organizes documentation, and reminds them of common Florida PIP-oriented dates (including the 14-day window as education—not a legal determination). Flat $500 instead of a contingency to ClaimSaver+. The customer remains the filer. Built by a licensed Florida adjuster who has seen both the carrier and claimant sides—the product is still software, not representation.

## What is the problem?

Florida PIP medical benefits are often capped around $10,000. After a crash, people face forms, authorizations, bills, and deadlines. Many hire a personal-injury attorney on a ~33% contingency for what is largely paperwork on a standard first-party claim. On a $10,000 example that is $3,300—before anyone has “won” anything. Others try to DIY and miss the 14-day treatment window or submit an incomplete file.

The gap is not “more lawyers.” It is a guided, honest software path for the large set of claims that are organization problems, with a clear off-ramp (When to Call an Attorney) when they are not.

## Why now?

Florida remains a large no-fault market. Consumers already upload medical records to portals. Stripe + cloud storage make a $500 software SKU operationally simple. Mobile camera capture matters because the first hour after a crash is when evidence exists and people are not at a desktop.

## How do you make money?

One-time **$500** platform access. No subscription on the core product. No percentage of PIP benefits. Optional **~$25** notarization. Illustrative comparison vs. 33% of $10,000 is marketing math only—not a guaranteed savings.

Gross margin is software-typical: Stripe fees, storage, and support (login/billing/how-to-use only).

## Who is the customer?

A Florida driver, occupant, pedestrian, or cyclist with a **standard PIP / no-fault** claim who wants to prepare and send their own materials. Incident types: car, motorcycle, truck, pedestrian, bicycle.

Not the customer (today): other states, BI lawsuits, UM/UIM fights, fleet stacking, people who need someone to call the insurer for them.

## Why will you win?

1. **Positioning honesty as the product.** Competitors in “accident help” blur into lead-gen for attorneys. We refuse that. Trust is the wedge in a category where the alternative takes 33%.
2. **Florida-specific workflow.** Eight-step worksheet aligned to the public no-fault packet, authorizations, fraud notice, 14-day education, milestone templates.
3. **Mobile-native capture** (v3). Photos and documents from the scene, same API as the web workspace.
4. **Founder-market fit.** Built from a family claim experience in Miami; we already shipped two versions and a live site.

## Competitors

- Personal-injury firms (contingency). Different job: representation. We send people to them when the claim leaves DIY.
- Insurer portals. They collect forms; they do not teach the packet, store the whole file, or remind the customer.
- Generic document apps (Drive, Dropbox). No PIP workflow, no Florida legal-boundary UX.
- LegalZoom-style forms. National, not Florida PIP-native, and often still “legal services” coded.

## How far along are you?

Live production site (v2) at claimsaverplus.com. v3 is a rebuild: shared typed API, Stripe entitlements, Expo app, cleaner data model. [Add: paying customers, revenue, conversion from signup → $500.]

## Traction (fill in)

| Metric | Now |
| --- | --- |
| Paying customers | |
| Revenue | |
| Signup → paid conversion | |
| Time-to-complete 8-step worksheet | |
| Support tickets that are “what should I do in my case?” (should stay near zero / redirected) | |

## Team

[Founder bio. Miami. Why this problem. Any Florida insurance/adjuster credentials to list on License & Credentials when ready—do not imply the software is licensed representation.]

## The ask / use of funds

YC batch: ship mobile, tighten conversion on $500 checkout, measure worksheet completion, and stay strictly inside software (no quiet move into public adjusting or attorney matching without a separate product).

Possible 2-year path: own Florida DIY PIP; then other no-fault / first-party states with the same “you file” rule.

## Risks we already designed for

Unauthorized practice of law and consumer-protection copy. v3 hard-codes the brief: no merit evaluation, no “we recovered $X,” no HIPAA badge, no bundling notarization into $500, 14-day rule never adjudicated by software.

## Demo script (2 minutes)

1. Homepage: “Not a law firm / Flat $500 / You stay in control.”
2. Checkout: select platform, not notarization; Stripe Checkout; webhook unlocks dashboard.
3. Worksheet: type an accident date → calendar seeds 14-day reminder labeled as general information.
4. Phone: photograph a crash card into the vault.
5. When to Call an Attorney: show the off-ramp.

Never say “we filed it” or “you’ll get paid.”
