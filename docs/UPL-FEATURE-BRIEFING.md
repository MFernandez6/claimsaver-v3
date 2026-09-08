# ClaimSaver+ — feature briefing for UPL / unauthorized-practice review

**Audience:** Florida insurance-regulatory and consumer counsel  
**Product:** CLAIMSAVERPLUS LLC d/b/a ClaimSaver+ (`claimsaverplus.com`)  
**Legal documents version:** `26.09.08` (effective September 8, 2026)  
**AI output policy version:** `26.09.08` (see `packages/shared/src/constants/legal.ts`)  
**This file is not a legal opinion.** It is a current-flow inventory so counsel can confirm which features are ministerial / scrivener-type activity versus activity that tells a user what to think or do about their claim.

**Ask:** a short written memo stating that the named features below are (or are not) ministerial / Scrivener-type document-preparation and deadline-tracking software, and flagging any screen or copy that has drifted toward advice, strategy, claim evaluation, or paid referral.

The screening question for every feature: **does this fill out a form or track a deadline (safer) versus tell the user what to think or do about their claim (risky)?**

---

## Positioning (intentional)

ClaimSaver+ is self-help software for Florida motor-vehicle no-fault (PIP) paperwork, especially PIP-only files that personal-injury firms often decline because a contingency fee does not make economic sense. Analog: tax-prep software for returns a CPA would not take. The customer remains the filer.

ClaimSaver+ is **not** BLACKLINE, **not** a licensed adjusting service, and **not** a paid referral to an attorney or public adjuster. There is no shared claim-handling logic and no implied warm handoff as part of the $500 product.

The founder’s Florida 6-20 number stays **off** the consumer site pending counsel’s separate §626.854 memo (`docs/LAUNCH-CHECKLIST.md`).

---

## Linear product flow (what ships)

1. **Account + clickwrap** — age 18+, ToS/Privacy, including the self-help / no attorney-client sentence. Version bump re-collects consent.
2. **Checkout** — one-time $500 software access (Stripe). Not a contingency, not a retainer.
3. **Intake worksheet** — 10 linear steps modeled on a common Florida no-fault application. Field validation is completeness/format, not “what to answer.”
4. **Form population** — the system stores answers the customer typed and generates a printable worksheet: “Based on your answers, here is the form our system generated.” Before save, the customer must acknowledge it is self-help, not advice, and that they send the package themselves.
5. **Document vault** — customer uploads; nothing is sent to a carrier from the product.
6. **Deadline tracking** — calendar dates counted from the accident date the customer entered, citing statutory topics (e.g. Fla. Stat. §627.736 14-day initial-services window and 30-day payment window) **without applying the statute to their facts**.
7. **Expense log** — amounts the customer types; not a settlement or claim-value estimate.
8. **Education** — Learning Center and “When to Call an Attorney” are general articles with outbound framing. No branch that says “if the insurer denies, argue X.”

There is **no** user-facing generative AI (Claude/GPT) in this repo. The versioned `AI_OUTPUT_POLICY` forbids advice, claim-strength, settlement estimates, outcome prediction, and strategy text if AI is added later.

---

## Feature inventory for the memo

| Surface | What it does | Intended category |
| --- | --- | --- |
| PIP worksheet (10 steps) | Customer enters facts; software stores and prints | Form fill / scrivener |
| Completeness checks | Missing-field list so the step can proceed | Ministerial validation |
| Printable worksheet | Copy-aid onto the insurer’s official form | Form fill |
| Document vault | Storage the customer controls | Storage |
| Calendar templates | Date math from accident date + statute cite | Deadline tracking |
| Expense log | Customer-entered dollars | Recordkeeping |
| Learning Center | General PIP education; links to statute/topics | Education, not personalized advice |
| When to Call an Attorney | General signals that a file may be more than paperwork | Education; not a referral service |
| Support email | Login, billing, how to use the site | Platform support only |
| Admin workspace | Account/deletion/records | Not an adjusting desk |

**Explicitly not in the product**

- Submitting the package to a carrier
- Calling or writing an adjuster on the customer’s behalf
- Negotiating
- Evaluating claim strength or “you have a strong claim”
- Estimating settlement or PIP recovery value (customer API `estimatedValue` is always `null`)
- Predicting payment, denial, or outcome
- Branching “if denied, argue X”
- Matching or referring the customer to an attorney or to BLACKLINE for a fee
- Generative AI advice text

---

## Persistent copy

The TurboTax-style site-wide bar and the long footer “self-help / no attorney-client / not BLACKLINE” blocks were removed from site chrome at product request. The same substance remains in the Terms of Service (§§1, 11, 19, 20) and the clickwrap still points to those terms. Do not put that sentence back on every page unless counsel asks for it.

---

## Screen paths to review (not just the concept)

Public: `/` (home + FAQ), `/who-we-are`, `/how-it-works`, `/pricing`, `/learning-center`, `/when-to-call-an-attorney`, `/terms-of-service`, `/privacy-policy`, footer on every page.

Authenticated: `/dashboard` (linear journey: enter info → docs → expenses → **you** send → reminders → **you** follow up), `/claim-form` (steps 1–10, especially review/save acknowledgement).

Counsel should read live English copy first; Spanish and French are convenience translations. English controls.

---

## Requested memo language (for counsel to adopt or revise)

Please confirm in writing, if accurate, that:

1. Guided form population from customer-entered answers, document storage, and calendar date math citing Fla. Stat. §627.736 without applying it to the customer’s facts are ministerial / scrivener-type software activities.
2. The product does not, on the current screens, provide legal advice, create an attorney-client relationship, evaluate claims, or operate a paid professional referral.
3. Any remaining phrase that should be cut or moved to general education (thePolicyLine / Learning Center) rather than in-product output.

Keep that memo in the defense file.
