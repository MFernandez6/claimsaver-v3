# Data map

Where personal and health information lives. Staff consoles must not add new copies of worksheets, medical details, or SSN.

| Place | What | Notes |
| --- | --- | --- |
| `profiles` | email, name, phone | Masked in `/admin` until reveal |
| `claims.worksheet` | claimant-entered PIP form | Claimant only. Admin never selects this column |
| `claim_documents` + Storage `claim-documents` | uploads, including medical files | Private bucket, signed URLs for the owner |
| `calendar_events`, `expenses` | dates and amounts the user entered | Claimant APIs |
| `legal_consents` | ToS/Privacy clickwrap | Kept for compliance |
| `purchases` | Stripe product, amount | Billing retention |
| `account_deletion_requests` | deletion queue | Soft-disable immediately; hard-delete after 30 days |
| `privacy_exports` | user’s own JSON package | 24h token; staff cannot download |
| `leads_14days` | campaign leads | Purged after 24 months if no account |
| `support_tickets` / `support_messages` | account/billing/technical | Email via Resend; claim-substance prohibited by policy |
| `clinics`, `clinic_enrollments` | clinic org + self-enroll | Progress = step/status only |
| `impersonation_sessions` | consented 30-minute view | Read-only |
| `audit_events` | append-only ops log | No worksheet/SSN in metadata |
| `auth.users` | Auth emails | Supabase Auth |
| `admin_sms_challenges` | hashed admin login codes | service_role only; 10-minute TTL |
| Resend | transactional email | Support replies, 14-day checklist, impersonation ask |
| Stripe | payments | Customer IDs, amounts |
| Vercel / logs | request metadata | No PII in URLs or Sentry breadcrumbs |

Counsel still reviews retention years (`RETENTION_YEARS`, default 7) and Florida FIPA / HIPAA BAA notice timelines.
