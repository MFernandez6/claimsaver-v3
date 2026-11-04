# Admin console

Staff manage the **software**, not a claimant's filing. The claimant stays the filer.

## Roles

| Role | Console |
| --- | --- |
| OWNER | `/admin` — software operations, clinics, deletion schedule, audit, emergency revoke |
| SUPPORT | `/admin` — users, tickets, consented impersonation. No role changes, no deletion approve |
| CLINIC_ADMIN / CLINIC_STAFF | `/clinic` only — enrolled patients’ checklist **progress**, not contents |
| CLAIMANT | Own claim + optional self-enroll at `/enroll/[code]` |

## Prohibited (never)

- Edit claim content or worksheet JSON
- Advise a claimant, or send claim-substance messages
- Write notes onto a specific claim
- Patient brokering (staff do not assign claimants to clinics)
- Bulk export of personal information (the user’s own export is the exception)
- Share data with BLACKLINE or sister companies
- Silent impersonation
- Show medical details by default

Handle health information as if HIPAA applies. Treat personal information under Florida FIPA §501.171.

## Clinics / BAA

A clinic cannot open enrollment until `baa_status = SIGNED` and `is_active`. Patients enroll themselves with the clinic’s link. Clinic dashboards select `status` and `worksheet_step` only.

## Impersonation

OWNER/SUPPORT request a session from a user page with a **ticket + reason**. The claimant approves on the dashboard. Session is 30 minutes and **read-only** (middleware blocks mutations). Snapshot APIs never return worksheet JSON.

## Staff login (email code)

After password login, `/admin/mfa` emails a 6-digit code to the OWNER inbox and also tries a text to `ADMIN_MFA_PHONE` (default +1 786-417-3869). Codes expire in 10 minutes and are stored hashed. Use the newest email if more than one arrives.

## Privacy

- OWNER schedules deletion: account disabled now, hard-delete after 30 days (`/api/cron/retention`).
- Users can download their own JSON export (24 hours, re-login). Staff cannot download that payload.
- `RETENTION_YEARS` defaults to 7; counsel must confirm.

## Env

`OWNER_SEED_EMAIL`, `ADMIN_MFA_PHONE`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`, `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`, `RETENTION_YEARS`, `RESEND_API_KEY`, `LEAD_IP_SALT`

## Cron

Vercel daily: `GET /api/cron/retention` with `Authorization: Bearer $CRON_SECRET`.

See `docs/data-map.md` and `docs/incident-response.md`.
