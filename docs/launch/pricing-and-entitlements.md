# Pricing and entitlements — proposed vs implemented

**Status:** Founder decisions recorded 20 Nov 2026. Code in this branch enforces one claim per purchase, clinic seat/enrollment caps, founding-price removal, and refund/dispute lockout. **Not applied to production until review.**  
**Brand (unchanged):** ClaimSaver+ — *Your claim. Your control. Our tools.*  
**This document is not a legal opinion, a public offer, or a live price list.**

### Decisions

| # | Decision |
| --- | --- |
| 1 | Patients still pay **$499**. Clinic **$299** is staff-dashboard software (3 seats, 25 active enrollments, progress tracking, invite link, founder onboarding). Not a patient license. |
| 2 | **One claim workspace per purchase.** Existing extra claim rows stay readable; new creates return 409. |
| 3 | Individual access stays indefinite. Retention stays **7 years** until counsel writes otherwise. |
| 4 | **Founding $199 removed.** `PILOT` (listed $0) and `STANDARD_299` (listed $299) remain. Existing `FOUNDING_199` rows map to `STANDARD_299`. |
| 5 | **Refunds and lost disputes revoke access.** User can pay $499 again. Open disputes do not revoke. |
| 6 | Outreach: **option A** — `stage`, `next_action_at`, consent columns on `outreach_records`. |
| 7 | HeyCatch stays as-is (email on purchase) until removal in ~2 months. |
| 8 | Clinic checkout: **founder-issued**, not self-serve (recommendation; no Stripe subscription built yet). |
| 9 | KPI cash / pitch: **OWNER only** at `/admin/results` and `/admin/pitch`. SUPPORT keeps ops overview. |
| 10 | **$25,000** on the OWNER pitch screen, labeled planning — not public, not a committed round. |
| 11 | **Active clinic claim** = a current `clinic_enrollments` row (slot occupied). Unenroll (when added) frees it. |
| 12 | Clinic “document management” = **counts/progress only**. No file list. Vault stays with the patient. |

---

## Commercial facts used in this audit

| Fact | Source | Status |
| --- | --- | --- |
| Individual list price | `PATIENT_PRICE_USD = 499` in `packages/shared/src/constants/pricing.ts`; Stripe Checkout `mode: "payment"` | **Implemented** as a one-time software-access SKU |
| Clinic list price | `CLINIC_PRICE_USD_MONTHLY = 299`; `CLINIC_TIER_PUBLIC` defaults false | **Quoted / admin metadata only.** No Stripe Subscription object is created |
| Paying customers / clinic subscriptions / collected revenue | Founder statement for this launch plan | **Pre-revenue by statement.** This audit did **not** query production Stripe or Postgres. Do not publish numbers until an admin KPI query against `purchases` + Stripe events exists |
| 90-day targets | 10 paying individuals, 5 paying clinic subscriptions, 20 qualified clinic demonstrations | **Targets only.** Must never appear as results |
| Funding figure | $25,000 for pitch planning | **Not an announced or committed round.** Do not put on public pages |

Do not claim legal representation, public adjusting, guaranteed insurance outcomes, or legal advice. The customer remains the filer.

---

## 1. Current server catalog (what Checkout can actually charge)

Authoritative amounts live in `packages/shared/src/constants/pricing.ts`. Clients send **product codes**, never dollar amounts. Checkout maps codes to `price_data.unit_amount`.

| Code | Sold at public checkout? | Amount | Mode | Grants |
| --- | --- | --- | --- | --- |
| `platform` | Yes (`CHECKOUT_PRODUCT_CODES`) | `$499.00` (`49900` cents) unless `PLATFORM_PRICE_TESTING` | Stripe Checkout `mode: "payment"` (one-time) | Sets `profiles.has_platform_access = true` |
| `notarization` | No (legacy only) | `$25.00` | Historical sessions | Inserts `notarization_orders` with a refund-if-charged note |
| Clinic monthly | No | `$299` constant; env `NEXT_PUBLIC_CLINIC_TIER_PUBLIC` must be `true` to show the dollar amount on public copy | **No Checkout session** | Admin writes `clinics.plan` (`PILOT` / `STANDARD_299`) |

Flags currently compiled as **false** (do not flip without an explicit production decision):

- `PLATFORM_PRICE_TESTING` — would charge `$1.00` instead of `$499`
- `SKIP_PAYMENTS_FOR_PROMO` — would skip Stripe and unlock the dashboard
- `NEXT_PUBLIC_CLINIC_TIER_PUBLIC` — public clinic dollar amount

Access after a successful `platform` payment is a **boolean with no expiry**. `POST /api/v1/claims` is limited to **one claim per user**. Refunds and lost disputes set `has_platform_access` false so the user can check out again.

---

## 2. Proposed commercial model (pending validation)

| Segment | Proposed price | Proposed entitlement | Access / retention |
| --- | --- | --- | --- |
| Individual client | **$499 one-time per claim** | One claim workspace | Duration and retention **TBD** (ops cron currently defaults `RETENTION_YEARS=7` pending counsel) |
| Clinic | **$299 / month** subscription | 3 staff seats, 25 **active** claims, document management, workflow/status tracking, reminders, founder-assisted onboarding | Seat and claim caps **not enforced**. Subscription lifecycle **not implemented** |

### Entitlement matrix

| Capability | Individual (proposed) | Individual (code today) | Clinic (proposed) | Clinic (code today) |
| --- | --- | --- | --- | --- |
| Pay | $499 / claim, one-time | $499 / account, one-time; one claim create after flag | $299 / month | Quote + `clinics.plan`; **no Stripe subscription** |
| Claim workspaces | 1 | `POST /claims` 409 after one row; extras already stored stay readable | 25 active enrollments | Server 409 at 25 `clinic_enrollments` |
| Staff seats | n/a | n/a | 3 | Server 409 at 3 `CLINIC_ADMIN` + `CLINIC_STAFF` |
| Guided worksheet, vault, calendar, expenses, package | Yes (self-filer) | Implemented for the paying **claimant** | Document mgmt / status / reminders as clinic tools | Clinic dashboard is **status + next-visit + document counts**, not worksheet/notes/medical |
| Reminders | Claimant calendar | Implemented (`reminders`, PIP deadline chain) | Clinic reminders | Claimant-side reminders; clinic does not own a separate reminder product |
| Onboarding | Self-serve checkout | Implemented | Founder-assisted | Manual admin clinic create + enrollment token; no billed onboarding SKU |
| Tenant isolation | User-scoped claims | API filters `user_id`; RLS on tables; **API uses service role** | Clinic-to-clinic isolation | App-layer `clinic_id` filter on service-role queries; **no clinic-scoped RLS policies** |
| Data clinic staff may see | n/a | n/a | Progress / workflow only (UPL-safe) | Enforced in `clinic/patients` mapper (no worksheet, notes, or medical payload) |

**Decided:** `$299/month` is a staff dashboard overlay. Each claimant still pays `$499`. Clinic staff never receive patient licenses or a cut of PIP benefits.

---

## 3. Billing records that exist today

| Store | What it holds | Gaps vs proposed model |
| --- | --- | --- |
| `purchases` | `user_id`, unique `stripe_session_id`, `product_code`, `amount_cents`, `status` (`paid` \| `refunded`) | `refunded` is written on `charge.refunded` / lost dispute. No `stripe_customer_id` or subscription id |
| `profiles.has_platform_access` | Boolean gate for worksheet/vault APIs (402 until true) | No TTL. Cleared when no remaining paid `platform` purchase |
| `billing_disputes` | Stripe dispute upsert by `stripe_dispute_id` | Lost disputes revoke access; open disputes do not |
| `clinics.plan` | `PILOT` (listed MRR $0), `STANDARD_299` ($299) | Admin-entered. `listedMrrCents()` is **display math**, not Stripe. Founding $199 removed |
| Stripe Checkout | `mode: "payment"`; `price_data` inline; metadata `userId`, `products` | No `mode: "subscription"`. No Stripe Price IDs |
| Webhook | `checkout.session.completed` / `async_payment_succeeded`; `charge.refunded`; `charge.dispute.created` / `updated` / `closed` | No `invoice.*` or `customer.subscription.*`. **No `stripe_events` idempotency table** yet |

Authorization after payment: `requirePlatformAccess` reads the profile flag. Staff roles are `OWNER` | `SUPPORT` plus clinic `CLINIC_ADMIN` | `CLINIC_STAFF`. Clinic APIs check membership in application code.

---

## 4. What must stay server-side (Phase 2, after approval)

- Prices and entitlements from `packages/shared` (and Stripe Price IDs if introduced). **Never** from the client body except product **codes**.
- Seat counts, active-claim counts, clinic membership, and clinic-to-clinic isolation on the API (service-role queries are not a substitute for a correct `WHERE clinic_id = …` plus tests).
- Webhook signatures (`STRIPE_WEBHOOK_SECRET`); persist Stripe `event.id` before side effects.
- KPI numbers from `purchases` / Stripe / outreach tables — **not** from HeyCatch, ads pixels, or founder targets.

---

## 5. Copy and catalog drift to resolve before publishing prices

- `PRODUCT_BRIEF.md` still describes “flat $500 platform access.” Live catalog is **$499**.
- `docs/ARCHITECTURE.md` still describes a two-SKU checkout including notarization. Public checkout sells **`platform` only**.
- `docs/UPL-FEATURE-BRIEFING.md` still says checkout is “one-time $500.” Legal-documents version in code is `26.11.05.3`; that briefing cites `26.09.08`.
- Clinic `$299` must not appear on public marketing unless `NEXT_PUBLIC_CLINIC_TIER_PUBLIC=true` **and** counsel/product approve the public offer.
- Do not publish 90-day targets, the $25,000 planning figure, or “customers/revenue” until verified.

## 6. Outreach pipeline (option A)

Requested stages: lead → contacted → visit scheduled → visited → demo completed → follow-up → negotiating → converted → lost.

Implemented as columns on `outreach_records`: `stage`, `next_action_at`, `consent_at`, `consent_source`. Clinic/client rows require a stage. Notes/scripts/tasks stay unstaged. Migration is in the repo; do not apply to production until review.

Related: [implementation-plan.md](./implementation-plan.md).
