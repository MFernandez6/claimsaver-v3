# ClaimSaver+ URL endings

Host: `https://www.claimsaverplus.com`

Printable copy: [ClaimSaver-Plus-url-endings.pdf](./ClaimSaver-Plus-url-endings.pdf)

## Hand these out

| Path | Who | What |
| --- | --- | --- |
| `/demo` | Clinics | Short URL for the 15-minute demo booking. Same page as `/clinic-demo`. |
| `/clinic-demo` | Clinics | Canonical canvassing URL. Book a 15-minute walkthrough. |
| `/for-clinics` | Clinics | Public explainer. Not an enroll link. |
| `/enroll/[code]` | Patients of a signed clinic | Unique invite. Issued from Admin → Clinics after the BAA is marked SIGNED. Do not print a generic enroll URL. |
| `/14days` | Consumers | 14-day PIP checklist campaign (`/es/14dias`, `/fr/14jours`). |

## Public marketing

| Path | What |
| --- | --- |
| `/` | Homepage |
| `/how-it-works` | Product walkthrough |
| `/pricing` | Patient checkout ($499). Clinic price is discussed on the demo. |
| `/who-we-are` | Company |
| `/license-credentials` | License & credentials |
| `/learning-center` | Education index |
| `/learning-center/how-to-file-pip-in-florida` | Article |
| `/learning-center/florida-pip-14-day-rule` | Article |
| `/learning-center/do-you-need-an-attorney` | Article |
| `/learning-center/pip-claim-documents-checklist` | Article |
| `/learning-center/common-pip-claim-mistakes` | Article |
| `/when-to-call-an-attorney` | Education, not intake |
| `/contact` | Platform support |
| `/data-handling` | Data handling summary |
| `/privacy-policy` | Privacy Policy |
| `/terms-of-service` | Terms of Service |
| `/accessibility` | Accessibility |
| `/14days/thanks` | 14-day lead thank-you (`/es/14dias/gracias`, `/fr/14jours/merci`) |

## Patient product (signed in)

| Path | What |
| --- | --- |
| `/login` | Sign in |
| `/signup` | Create account |
| `/forgot-password` | Reset request |
| `/update-password` | Set new password |
| `/checkout-account` | Account before Stripe Checkout |
| `/success` | Post-payment |
| `/dashboard` | Patient home. OWNER/SUPPORT are redirected to `/admin`. |
| `/claim-form` | Guided PIP worksheet |

## Clinic staff (signed in)

| Path | What |
| --- | --- |
| `/clinic` | Clinic dashboard. Progress only — never worksheet answers, vault files, or medical details. CLINIC_ADMIN / CLINIC_STAFF. |

## Internal review (OWNER / SUPPORT)

| Path | What |
| --- | --- |
| `/films` | Promo films for phone review. Sign in as OWNER/SUPPORT. Not indexed. |

## Admin console (OWNER / SUPPORT)

| Path | What |
| --- | --- |
| `/admin` | Overview |
| `/admin/mfa` | Staff email/SMS code after password login |
| `/admin/leads` | 14-day leads |
| `/admin/users` | User search |
| `/admin/users/[id]` | User detail |
| `/admin/support` | Tickets |
| `/admin/support/[id]` | Ticket detail |
| `/admin/clinics` | Clinics; BAA; enroll URL after SIGNED |
| `/admin/clinics/[id]` | Clinic detail |
| `/admin/pilots` | Pilot clinics |
| `/admin/privacy` | Deletion schedule |
| `/admin/audit` | Audit log |
| `/admin/roles` | Staff seats |
| `/admin/system` | System / emergency revoke |

## Auth plumbing

| Path | What |
| --- | --- |
| `/auth/callback` | Supabase auth callback |

## Redirects (old endings)

| From | To |
| --- | --- |
| `/demo` | Serves `/clinic-demo` (rewrite; URL can stay `/demo`) |
| `/what-we-do` | `/how-it-works` |
| `/signin`, `/sign-in` | `/login` |
| `/sign-up` | `/signup` |
| `/need-professional-help` | `/when-to-call-an-attorney` |
| `/notarization` | `/pricing` |

Do not index `/admin`, `/clinic`, `/enroll/`, or `/films` (`robots.txt`).
