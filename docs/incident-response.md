# Incident response (internal)

This is an operating brief, not a legal opinion. Counsel confirms notice timelines before a live clinic BAA.

## Who to contact

- Owner / on-call: `support@claimsaverplus.com`
- Healthcare/privacy counsel (BAA and HIPAA notice)
- Florida FIPA counsel (Fla. Stat. §501.171)

## First hour

1. **Revoke admin sessions** from `/admin/system` (OWNER, active SMS admin session). This stamps `admin_ops_state.admin_revoked_at` and globally signs out OWNER/SUPPORT.
2. Rotate `SUPABASE_SERVICE_ROLE_KEY`, Stripe restricted keys, `RESEND_API_KEY`, and `CRON_SECRET`.
3. Pull `/admin/audit` (OWNER). Export is view-only; do not bulk-download claimant files.
4. If a clinic’s PHI may be involved, notify counsel before emailing patients. BAA terms may require faster notice to the clinic than FIPA’s individual notice window.

## Notice (attorney to confirm)

- Florida FIPA generally discusses notice to affected individuals within 30 days of a qualifying personal-information breach.
- A signed clinic BAA may require faster notice to that clinic.

## What not to do

- Do not open worksheets, medical documents, or SSN to “see how bad it is.”
- Do not share data with BLACKLINE or sister companies.
- Do not email claimants about the substance of a PIP filing.
