# Launch checklist (items 4–8)

This is an **internal operating brief**, not a legal opinion, insurance binder, or tax ruling. Items 1–3 are in the product (ToS/Privacy v2026-09-04, clickwrap, CLAIMSAVERPLUS LLC named). Notarization is not sold. Items 4, 6, and Florida sales-tax confirmation still need counsel / broker / CPA.

## 4. Licensing vs Florida §626.854 (counsel briefing)

**Ask Florida insurance-regulatory counsel for a written opinion.** This file is only the product facts to hand them.

### What the platform does

- Sells **self-serve software** (guided Florida PIP worksheet, document vault, calendar, educational reminders).
- Customer remains the **filer**. Software does **not** submit the package to a carrier, call an adjuster, negotiate, or evaluate claim merits.
- Public copy states we are **not** a law firm, **not** a public adjuster, and **not** the customer’s representative.
- Founder holds an active Florida **6-20 All-Lines Adjuster** license (G279764). That number is published as **founder background**, not as a sold adjusting service.
- Reminders (including the 14-day treatment window) are labeled **education**, driven by dates the customer enters, and are **not** a determination that a visit “counts.”

### What counsel should confirm or redesign

- Whether reminders + form-completion software, with an active 6-20 on the founder, stay on the **unlicensed-adjusting** safe side of §626.854 (and related DFS guidance).
- Whether any remaining marketing, admin screens, or “we help you file” phrasing should be tightened.
- Whether the 6-20 should stay on the public footer or be moved off consumer pages.

Until that memo exists, do not describe ClaimSaver+ as adjusting, representation, or claim evaluation.

## 5. Notarization — not offered

Public checkout, footer, sitemap, and legal copy **do not sell notarization**. `/notarization` redirects to `/pricing`. Copy may mention **future add-ons** only.

The `notarization` product code remains in the database/webhook so an old Stripe session can still record. If one still charges, refund it. Do not list or sell the add-on again until a Florida-commissioned RON path is confirmed.

## 6. Cyber / tech E&O insurance (Miguel + broker)

The product stores accident and medical files and takes card payments. ToS liability limits are **not** a substitute for insurance.

Ask a broker who places **cyber + technology E&O** for a Florida SaaS that holds PHI-like consumer medical records. Typical asks: breach response, ransomware, funds-transfer / social-engineering, media, and professional-services E&O. Bind coverage **before** real customer volume.

## 7. Stripe chargeback / dispute playbook (~$500 platform)

Webhook `charge.dispute.created` / `updated` writes `billing_disputes` (Stripe dispute id, amount, reason, payload, and user id when Checkout metadata can be resolved).

### When a dispute lands

1. Open the Stripe Dashboard dispute **immediately** (response windows are short).
2. Pull the customer’s `legal_consents` row for ToS/Privacy (version, `accepted_at`, IP, user-agent, source: signup / checkout / pricing / reaccept).
3. Pull `purchases` for that user (`stripe_session_id`, `product_code`, `amount_cents`, `status`).
4. Pull product usage: worksheet saved (`claims.updated_at`, `worksheet_step`), document count, login timestamps if available.
5. Submit evidence in Stripe:
   - Clickwrap: checkbox copy + stored consent timestamp/version.
   - Checkout receipt and product description (software access, not a legal result).
   - ToS refund policy (digital access delivered on payment; 14-day unused-worksheet window).
   - Usage showing the customer opened the workspace or saved a draft (if they did).
6. Do **not** argue the customer’s PIP outcome. The product does not promise benefits.

Refund promptly when the customer never received access. Contest “I didn’t authorize” / “not as described” when the clickwrap and usage logs show they agreed and used the software.

## 8. Business entity and Florida sales tax (Miguel + CPA)

The operating entity is **CLAIMSAVERPLUS LLC**, a Florida LLC filed in **2026**, d/b/a **ClaimSaver+**. ToS, Privacy, and the footer use that name.

Confirm with Sunbiz + Stripe + the bank that this LLC (not BLACKLINE or another entity) is:

- the Stripe account legal entity,
- the party named on customer receipts,
- the entity that holds customer funds and the support inbox.

Ask a Florida CPA whether this **one-time SaaS access** is taxable under Florida sales/use tax. Register or collect only as that CPA instructs.

## Apply before production traffic

```bash
# From repo root, linked Supabase project
npx supabase db push
```

Migration `supabase/migrations/005_launch_readiness.sql` creates `legal_consents`, `account_deletion_requests`, `notarization_orders`, and `billing_disputes`. Until it is applied, `/api/v1/me` fail-opens (no re-accept wall) and consent inserts will 500.

Existing accounts will see the **Updated Terms** modal after the table exists, because they have no `2026-09-04` consent row yet. That is intended.
