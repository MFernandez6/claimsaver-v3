# Launch implementation plan

**Phase:** Founder decisions 20 Nov 2026 are landing in this branch. **Do not push to production until review.** Do not apply the new SQL migration to the live Supabase project until you say so.  
**Brand:** ClaimSaver+ — *Your claim. Your control. Our tools.*  
**Legal boundary:** software tools; claimant stays the filer; no legal representation, public adjusting, guaranteed outcomes, or legal advice.

This plan is based on the repository as audited (Next.js 15 App Router `apps/web`, Expo `apps/mobile`, npm workspaces, `@claimsaver/shared`, Supabase Postgres/Auth/Storage, Stripe Checkout, Vercel). Features not found in code are listed as **missing**, not assumed.

---

## 0. Approval gate — potential breaking changes

Do **not** implement the following until the founder (and, where marked, counsel) approve the intended behavior.

| ID | Change | Status |
| --- | --- | --- |
| B1 | One claim per $499 | **In this branch.** Extra existing rows stay readable; `POST` returns 409 |
| B2 | Access duration / retention | **Keep as-is** (no TTL; `RETENTION_YEARS=7`) |
| B3 | Clinic Stripe Subscriptions | **Not started.** Founder-issued Checkout later; no live clinic charges |
| B4 | What $299 includes | **Staff dashboard, not patient licenses.** Features listed on `/for-clinics` without publishing $299 unless `CLINIC_TIER_PUBLIC` |
| B5 | 3 seats / 25 active enrollments | **In this branch** (server 409). Clinics already over the cap cannot add more |
| B6 | Remove founding $199 | **In this branch** (`PILOT` \| `STANDARD_299`; leftover `FOUNDING_199` maps to listed $299). Migration not applied to production |
| B7 | Refunds and lost disputes revoke access | **In this branch.** Open disputes do not revoke. Repurchase allowed |
| B8 | Outreach pipeline stages | **Option A in this branch.** `stage` / `next_action_at` / `consent_*` on `outreach_records`. Migration not applied to production |
| B9 | Clinic-scoped RLS | **Not started** |
| B10 | HeyCatch email | **Keep until HeyCatch is removed (~2 months)** |
| B11 | Stripe Price IDs | **Not started** |
| B12 | KPI / pitch screens | **In this branch.** OWNER `/admin/results` and `/admin/pitch`. SUPPORT cannot open them |

**Explicitly out of scope until approval:** any migration applied to the live Supabase project, any new Stripe webhook endpoint in the Dashboard, any `NEXT_PUBLIC_CLINIC_TIER_PUBLIC=true`, flipping `PLATFORM_PRICE_TESTING` or `SKIP_PAYMENTS_FOR_PROMO`, and any public copy that states clinic $299 as a live offer.

---

## 1. Stack inventory (verified)

| Layer | Implementation |
| --- | --- |
| Web | Next.js 15.5 App Router, `apps/web` |
| Mobile | Expo 53, `apps/mobile`, same `/api/v1` |
| Shared contracts | `packages/shared` (Zod, pricing, legal constants) |
| Database | Supabase Postgres — **15** SQL migrations under `supabase/migrations/` |
| Auth | Supabase Auth (cookie + Bearer). Roles: `user_roles` (`OWNER`, `SUPPORT`), `clinic_memberships` (`CLINIC_ADMIN`, `CLINIC_STAFF`) |
| Billing | Stripe Checkout Sessions `mode: "payment"`; webhook `apps/web/src/app/api/v1/webhooks/stripe/route.ts` |
| Deploy | Vercel production `www.claimsaverplus.com` from GitHub `main`. **No `.github/workflows` CI** |
| Analytics | HeyCatch SDK (client instrumentation + purchase webhook). Ads pixels optional via env |
| Email / SMS | Resend, optional Twilio, admin MFA SMS |
| Cron | `/api/cron/retention` gated by `CRON_SECRET` |

### Environment variables (from `.env.example` + code)

Public: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `PUBLISHABLE_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_CLINIC_TIER_PUBLIC`, `NEXT_PUBLIC_CLINIC_DEMO_BOOKING_URL`, `NEXT_PUBLIC_GOOGLE_ADS_*`, `NEXT_PUBLIC_META_PIXEL_ID`.

Secret: `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `LEAD_IP_SALT`, `OWNER_SEED_EMAIL`, `ADMIN_MFA_PHONE`, `TWILIO_*`, `CRON_SECRET`, `RETENTION_YEARS`, `DEV_UNLOCK_PLATFORM` (ignored in production), optional DocuSign, Expo public mirrors.

**Missing for Phase 2 (do not add until approved):** `STRIPE_PRICE_PLATFORM`, `STRIPE_PRICE_CLINIC_MONTHLY`, `STRIPE_WEBHOOK_SECRET` already exists (reuse), no Metronome.

---

## 2. Capability inventory

### Implemented (in repo and wired)

- Account, clickwrap, legal version `26.11.05.3`
- Individual Stripe Checkout for `platform` at **$499**; webhook writes `purchases` and sets `has_platform_access`
- Claimant workspace: claims, 10-step PIP worksheet, vault, calendar / PIP deadline chain, expenses, package/export, reminders
- 402 gate on platform APIs until paid (unless local `DEV_UNLOCK_PLATFORM`)
- Clinic **progress** dashboard + enrollment token; staff cannot load worksheet/notes/medical via clinic patient mapper
- Admin console (`/x`): users, clinics, tickets, privacy/deletion, system, impersonation, SMS MFA
- Staff outreach desk (`/claims-clinic-outreach`) persisted in `outreach_records` (generic kinds, not CRM stages)
- 14-day campaign leads (`leads_14days`)
- i18n en / es / fr marketing
- Rate limits, CSP (includes HeyCatch ingest), audit_events, account deletion requests
- Tests for pricing copy, checkout amount authority, several admin/clinic mappers, webhook amount check (see `apps/web/src/**/*.test.ts`)

### Partial

- Clinic commercial relationship: `clinics.plan`, BAA status, `listedMrrCents` — **not billed**
- Mobile app: API client exists; checkout is a browser handoff to `/pricing`
- Refunds: ToS + enum; **no** Stripe refund webhook / Dashboard automation
- Disputes: stored; **access not revoked**
- Outreach: staff-only persistence; **not** the requested pipeline
- Admin overview: ops counts, not verified cash
- Tenant isolation: app-layer on service role
- Document management / workflow for **clinics**: document **counts** and visit status, not a clinic-owned vault of claim files
- Reminders: claimant-side; not a clinic-seat product
- Founder-assisted onboarding: operational (admin create clinic), not an entitlement flag

### Missing (proposed Phase 2)

- Stripe Billing subscriptions, renewals, cancellation, past_due, customer portal
- Central entitlement service (seats, active claims, one-claim individual SKU, TTL)
- Webhook event-id idempotency table; refund + invoice.payment_failed handlers
- `stripe_customer_id` / `subscription_id` on clinics (and optionally users)
- CRM stages, next-action, consent fields as first-class columns
- Internal KPI dashboard from verified payment + outreach events, with **actuals vs targets** split
- Server-enforced clinic-to-clinic RLS
- Tests listed in §6
- GitHub Actions CI
- Acquisition-cost KPI (no expense ledger in DB; ads pixels are not a cost source)

---

## 3. Payment / authorization map (as implemented)

```
Claimant → POST /api/v1/checkout { products: ["platform"] }
        → Stripe Checkout mode=payment, unit_amount from PRODUCTS.platform
        → success /pricing cancel
        → POST /api/v1/webhooks/stripe  (signature required)
             checkout.session.completed + payment_status=paid
             + amount_total >= sum(PRODUCTS[code])
             → upsert purchases (stripe_session_id unique per session:code)
             → profiles.has_platform_access = true
             → HeyCatch purchase_completed (email/name if present)
        → requirePlatformAccess on /api/v1/claims, documents, etc.

Clinic $299 → marketing quote / demo booking URL
           → admin creates clinics row (plan, BAA)
           → enrollment token; patient still needs own platform flag
           → no invoice, no subscription webhook, no seat/claim limiter
```

Handled webhook types: `checkout.session.completed`, `charge.dispute.created`, `charge.dispute.updated`.  
Not handled: `charge.refunded`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated|deleted`, `checkout.session.expired`.

Idempotency: unique `purchases.stripe_session_id` only. Duplicate events can re-insert `notarization_orders`. Returning `{ received: true }` on underpay **acks** the event (Stripe will not retry); that is intentional for bad amounts but means a bug in amount math would silently skip fulfillment.

---

## 4. Privacy, security, Florida issues — qualified review required

Not legal advice. Flag for counsel / security review before Phase 2 ships.

1. **UPL / self-help.** Product must remain tools for the claimant-filer. Clinic staff surfaces must not grow worksheet, medical narrative, or “what to argue” content. Existing briefing: `docs/UPL-FEATURE-BRIEFING.md` (version drift vs `LEGAL_DOCUMENTS_VERSION`).
2. **Florida public adjuster (§626.854) and 6-20.** Founder license stays **off** consumer pages pending counsel (`docs/LAUNCH-CHECKLIST.md`).
3. **HIPAA / clinic BAA.** `clinics.baa_status` and `canOpenEnrollment` exist. Whether treatment-progress sharing plus document **counts** is PHI, and whether ClaimSaver+ is a BA for clinics, needs qualified HIPAA review. Do not expand clinic-visible fields without that review.
4. **Florida records retention vs deletion.** `RETENTION_YEARS` default 7 vs consumer deletion requests — counsel must confirm before changing cron behavior.
5. **Individual access duration TBD** vs indefinite `has_platform_access`.
6. **Service-role API.** Correct filters are load-bearing. Clinic isolation tests are mandatory before claiming tenant security. RLS-by-clinic is stronger but risky (B9).
7. **SSN in worksheet JSON.** List endpoints strip SSN; raw JSON remains in `claims.worksheet`. Logging and HeyCatch must never receive worksheet payloads.
8. **HeyCatch + ads pixels.** Purchase webhook currently sends email/name. Marketing tools are not a system of record and must not receive claim or health content. Confirm whether email is allowed under the privacy policy.
9. **Outreach CRM.** Storing clinic contact details and notes is fine for internal ops; **TCPA / email consent** for outbound sequences needs a consent field and policy before automated messaging.
10. **Pre-revenue / funding copy.** Publishing $25,000 or customer counts would be a misrepresentation risk. Keep actuals vs targets separate in every UI.
11. **PCI.** Stay on Stripe Checkout / Billing hosted surfaces; do not collect PANs.
12. **Secrets.** Restricted Stripe key is documented as preferred; webhook secret required. Do not log request bodies of claim APIs.

---

## 5. File-by-file Phase 2 plan (after approval)

Implement in this order. Prices/entitlements stay server-side. No live-mode toggle in this work.

### 5.1 Catalog and entitlements (no live Stripe objects until go-live checklist)

| File | Change |
| --- | --- |
| `packages/shared/src/constants/pricing.ts` | Add clinic product code; keep `$499` / `$299` as constants; do not read amounts from the client. Optionally reference Stripe Price ID **env** names without enabling live charges |
| `packages/shared/src/constants/entitlements.ts` **(new)** | `INDIVIDUAL_ACTIVE_CLAIMS = 1` (if B1 approved), `CLINIC_SEATS = 3`, `CLINIC_ACTIVE_CLAIMS = 25`, access TTL if B2 approved |
| `packages/shared/src/index.ts` | Export entitlements |
| `apps/web/src/lib/copy/pricing.ts` + `pricing.test.ts` | Keep clinic dollar amount behind `CLINIC_TIER_PUBLIC`; never treat env as a price |
| `PRODUCT_BRIEF.md`, `docs/ARCHITECTURE.md`, `docs/UPL-FEATURE-BRIEFING.md` | Align $499 vs $500 and notarization-off-checkout **as copy**, only when product agrees — not a public price change |

### 5.2 Schema (apply to **non-production** first)

| File | Change |
| --- | --- |
| `supabase/migrations/YYYYMMDDHHMMSS_billing_entitlements.sql` **(new)** | `stripe_events(id text primary key, type, received_at)` for idempotency; `purchases` columns for `stripe_customer_id`, `stripe_payment_intent_id`, refund timestamps if needed; `clinics.stripe_customer_id`, `stripe_subscription_id`, `subscription_status`; optional `entitlement_grants` table rather than overloading the boolean flag |
| `supabase/migrations/YYYYMMDDHHMMSS_outreach_pipeline.sql` **(new)** | If B8 approved: `stage` check constraint with the nine stages; `next_action_at`, `consent_at` / `consent_source`; keep existing JSON `data` |
| RLS policies on `clinic_*` | Only if B9 approved; otherwise keep service-role + stricter repository helpers |

Do not write production DML. Do not backfill fake payments.

### 5.3 Stripe one-time + subscriptions

| File | Change |
| --- | --- |
| `apps/web/src/lib/stripe/server.ts` | Unchanged getter; add helpers for subscription Checkout only after Price IDs exist in **test** mode |
| `apps/web/src/app/api/v1/checkout/route.ts` | Keep individual `mode: "payment"`. Add a **separate** staff/admin or clinic-owner route for `mode: "subscription"` — do not overload product codes in one session until catalog is decided (B4) |
| `apps/web/src/app/api/v1/webhooks/stripe/route.ts` | Persist `event.id` first; handle refund, subscription lifecycle, `invoice.payment_failed`; revoke or suspend per B7; **stop sending claim fields**; consider dropping email from HeyCatch (B10) |
| `apps/web/src/lib/billing/fulfillment.ts` **(new)** | Pure functions: amount check, grant/revoke, subscription status → entitlements |
| `apps/web/src/lib/billing/fulfillment.test.ts` **(new)** | State machine tests including retry of the same `event.id` |

Use existing Stripe. No second processor. No client `unit_amount`.

### 5.4 Authorization and isolation

| File | Change |
| --- | --- |
| `apps/web/src/lib/supabase/auth.ts` | Replace boolean-only gate with entitlement helper when B1/B2 approved |
| `apps/web/src/app/api/v1/claims/route.ts` | Enforce active-claim cap for individuals (B1) |
| `apps/web/src/app/api/v1/clinic/**` | Enforce membership, seat cap on invite, active-claim cap on enrollment; **always** filter `clinic_id` from the membership row, never from the client body |
| `apps/web/src/lib/api/clinic-isolation.test.ts` **(new)** | Two clinics, swapped IDs, expect empty/403 |
| Clinic patient mapper | Do not expand PHI fields |

### 5.5 Outreach pipeline (admin/staff only)

| File | Change |
| --- | --- |
| `apps/web/src/lib/outreach/records.ts` | Validate new stages; consent fields |
| `apps/web/src/app/claims-clinic-outreach/**` | UI for stage, notes, next action; **no claim worksheet data** |
| `apps/web/src/app/claims-clinic-outreach/api/records/route.ts` | Keep `requireStaff` + same-origin write header |

Public marketing must not expose this desk.

### 5.6 Internal KPI dashboard

| File | Change |
| --- | --- |
| `apps/web/src/app/api/v1/admin/kpis/route.ts` **(new)** | `requirePermission` owner-only. Metrics from `purchases` (paid, non-refunded), `clinics.subscription_status`, outreach `stage = demo completed` / `converted`, churn from subscription canceled. **Targets as a labeled constant object, never mixed into the same number** |
| `apps/web/src/app/x/kpis/page.tsx` **(new)** | Actuals vs “90-day target” panels. Empty/zero is valid pre-revenue |
| `apps/web/src/app/api/v1/admin/overview/route.ts` | Keep ops counts; do not relabel `listedMrrCents` as revenue |
| Acquisition cost | Only if an **expense** table is added later; ads pixels are not costs |

Never send worksheet, documents, or medical fields into this API or into logs.

### 5.7 Tests (required before considering production)

| File | Coverage |
| --- | --- |
| `packages/shared` pricing tests | $499 / $299 constants; client cannot set cents |
| `apps/web/src/app/api/v1/checkout/route.test.ts` (extend) | Reject extra product codes; subscription route auth |
| `fulfillment.test.ts` | paid, replayed webhook, refund, failed invoice, dispute |
| `claims/route` tests | second claim blocked if B1 |
| clinic isolation + seat/claim cap tests | cross-tenant |
| KPI tests | fixtures; **targets not added into actuals**; zero purchases → $0 |

### 5.8 Explicit non-goals for Phase 2

- Rewriting the application
- Enabling live clinic charges
- Public clinic price page unless `CLINIC_TIER_PUBLIC` is separately approved
- Inventing customers, MRR, or testimonials
- Logging PHI
- CI/CD auto-deploy from this plan
- Changing production data

---

## 6. Rollout sequence (after approval, still not “go live”)

1. Land catalog + entitlement constants + tests on a branch.
2. Apply migrations to a **staging** Supabase project; never the live project from this plan.
3. Stripe **test** mode Price IDs + test webhook endpoint.
4. Staff-only outreach stages + KPI page reading test data.
5. Security/UPL pass on clinic surfaces.
6. **Separate** production go-live checklist: restricted key, live webhook, Price IDs, counsel on public clinic offer, retention, BAA.

---

## 7. Questions that block implementation

Answer these in writing; Phase 2 should not guess.

1. Does clinic **$299/month include 25 patient software licenses**, or do patients still pay **$499** while the clinic pays for the staff dashboard?
2. Confirm **one claim per $499** even for accounts that already have multiple `claims` rows — grandfather or freeze extras?
3. Individual **access duration** and **retention** (keep 7-year default until counsel writes otherwise?).
4. Keep, map, or delete **`FOUNDING_199` / `PILOT`** plans?
5. Do **refunds and lost disputes** revoke software access immediately?
6. New outreach **`stage` column** vs new table vs JSON-only (B8)?
7. May HeyCatch keep **email** on `purchase_completed`, or identity = opaque user id only?
8. Who can start a clinic subscription — clinic admin self-serve, or founder-issued Checkout link only?
9. KPI dashboard: **OWNER only** or also `SUPPORT`?
10. Is **$25,000** allowed on any internal pitch screen, or planning docs only?
11. Active claim definition: `status != closed`? Treatment still open? 14-day window?
12. Clinic “document management”: clinic-visible **file list** (likely PHI) vs current **counts only**?

---

## 8. Recommended approval reply

A sufficient approval looks like:

> Approve B# … with answers to questions 1–12. Do not apply migrations to production. Do not enable live clinic subscriptions. Do not set `NEXT_PUBLIC_CLINIC_TIER_PUBLIC`. Keep tagline and UPL boundaries.

Until that reply, **stop at these two documents.**
