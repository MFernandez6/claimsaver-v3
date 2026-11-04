#!/usr/bin/env python3
"""Founder walkthrough PDF for production QA."""
from __future__ import annotations

from pathlib import Path

from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "docs" / "ClaimSaver-Plus-founder-QA.pdf"

TEAL = HexColor("#0f766e")
TEAL_DARK = HexColor("#134e4a")
SLATE = HexColor("#0f172a")
MUTED = HexColor("#475569")
LINE = HexColor("#cbd5e1")
AMBER_BG = HexColor("#fff7ed")
AMBER = HexColor("#9a3412")
PAPER = HexColor("#f8fafc")


def styles():
    base = getSampleStyleSheet()
    return {
        "kicker": ParagraphStyle(
            "kicker",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=9,
            textColor=TEAL,
            tracking=1.2,
            spaceAfter=4,
        ),
        "h1": ParagraphStyle(
            "h1",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=22,
            leading=26,
            textColor=SLATE,
            spaceAfter=8,
        ),
        "lede": ParagraphStyle(
            "lede",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=11,
            leading=16,
            textColor=MUTED,
            spaceAfter=14,
        ),
        "h2": ParagraphStyle(
            "h2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=13,
            leading=17,
            textColor=TEAL_DARK,
            spaceBefore=14,
            spaceAfter=6,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            textColor=SLATE,
            spaceAfter=6,
        ),
        "small": ParagraphStyle(
            "small",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            textColor=MUTED,
        ),
        "item": ParagraphStyle(
            "item",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=10,
            leading=13.5,
            textColor=SLATE,
        ),
        "warn": ParagraphStyle(
            "warn",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            textColor=AMBER,
        ),
        "footer": ParagraphStyle(
            "footer",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8,
            textColor=MUTED,
            alignment=TA_LEFT,
        ),
    }


def bullets(items: list[str], s, numbered=True):
    kind = "1" if numbered else "bullet"
    flow = []
    for text in items:
        flow.append(
            ListItem(Paragraph(text, s["item"]), leftIndent=12, value="1" if numbered else "•")
        )
    return ListFlowable(flow, bulletType=kind, start="1", leftIndent=18, spaceAfter=8)


def callout(text: str, s):
    inner = Paragraph(text, s["warn"])
    table = Table([[inner]], colWidths=[7.1 * inch])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), AMBER_BG),
                ("BOX", (0, 0), (-1, -1), 0.6, HexColor("#fdba74")),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    return table


def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(SLATE)
    canvas.rect(0, letter[1] - 36, letter[0], 36, fill=1, stroke=0)
    canvas.setFillColor(TEAL)
    canvas.rect(0, letter[1] - 38, letter[0], 3, fill=1, stroke=0)
    canvas.setFillColor(white)
    canvas.setFont("Helvetica-Bold", 9)
    canvas.drawString(0.7 * inch, letter[1] - 22, "ClaimSaver+")
    canvas.setFont("Helvetica", 9)
    canvas.drawRightString(letter[0] - 0.7 * inch, letter[1] - 22, "Founder walkthrough  ·  4 Nov 2026")
    canvas.setFillColor(LINE)
    canvas.rect(0, 0, letter[0], 28, fill=1, stroke=0)
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(0.7 * inch, 12, "Staff manage the software. The claimant stays the filer. Not a law firm.")
    canvas.drawRightString(letter[0] - 0.7 * inch, 12, f"Page {doc.page}")
    canvas.restoreState()


def build():
    s = styles()
    doc = SimpleDocTemplate(
        str(DEST),
        pagesize=letter,
        leftMargin=0.7 * inch,
        rightMargin=0.7 * inch,
        topMargin=0.7 * inch,
        bottomMargin=0.55 * inch,
        title="ClaimSaver+ founder QA walkthrough",
        author="ClaimSaver+",
    )
    story = []

    story.append(Paragraph("FOUNDER QA  ·  PRODUCTION", s["kicker"]))
    story.append(Paragraph("Things to check on claimsaverplus.com", s["h1"]))
    story.append(
        Paragraph(
            "Use this after the admin-console deploy. Work top to bottom. Tick a box only when you saw the behavior yourself. Do not test on a real paying claimant if a throwaway account will do.",
            s["lede"],
        )
    )
    story.append(
        callout(
            "<b>One production env to set in Vercel</b> (Settings → Environment Variables → Production): "
            "<b>CRON_SECRET</b> — a long random string. The daily retention job at 11:00 UTC "
            "(<font face='Courier'>GET /api/cron/retention</font>) will 401 until this exists. "
            "Optional: <b>RETENTION_YEARS</b> (defaults to 7; counsel still confirms). "
            "<b>OWNER_SEED_EMAIL</b> is already support@claimsaverplus.com.",
            s,
        )
    )

    story.append(Paragraph("0. Ground rules while you click", s["h2"]))
    story.append(
        bullets(
            [
                "Staff manage the <b>software</b>, not a filing. You are never the filer from /admin or /clinic.",
                "Do not open a claimant worksheet, notes, documents, or medical details from a staff surface. Those pages should not exist in the console.",
                "Florida statute <b>discusses</b> a 14-day window. Do not talk as if you are giving legal advice.",
                "Search users by <b>exact email or user ID</b> only. Names and partial matches are blocked on purpose.",
                "Do not schedule deletion, impersonation, or role changes on a real customer unless you mean it.",
            ],
            s,
            numbered=False,
        )
    )

    story.append(Paragraph("1. Public website  ·  www.claimsaverplus.com", s["h2"]))
    story.append(
        bullets(
            [
                "Home: “File Your Florida No-Fault Claim. Keep What's Yours.” Flat $500. You stay the filer. Not a law firm. English / Spanish / French in the header.",
                "Scroll to “Florida is a no-fault state. The paperwork still isn't.” Confirm Option one (file it yourself) and Option two (hire a PI firm) — not a third option where ClaimSaver+ files for them.",
                "<b>/how-it-works</b> — PIP in 5 steps. Copy says you handle every step.",
                "<b>/pricing</b> — Guided Claim Platform $500.00. Terms + Privacy clickwrap before Continue.",
                "<b>/who-we-are</b> — family story. Still self-help software, not a firm.",
                "<b>/when-to-call-an-attorney</b> — still live; we do not hide the “get a lawyer” path.",
                "14-day banner on public pages (not on /14days itself). Dismiss it; it should stay gone on refresh.",
            ],
            s,
        )
    )

    story.append(Paragraph("2. 14 DAYS. campaign  ·  already on production", s["h2"]))
    story.append(
        bullets(
            [
                "<b>/14days</b> — giant “14 DAYS.” hero. Subline: hurt in a crash in Florida / medical care / PIP benefits. CTA “Get the free checklist.”",
                "Language toggle EN | ES | FR. Open <b>/es/14dias</b> (“14 DÍAS.”) and <b>/fr/14jours</b> (“14 JOURS.”).",
                "Cards: 14 days to get treated · insurer may require exams · PIP doesn't cover everything. Statute language, not advice.",
                "Submit the form with a throwaway email you control. Honeypot field named website must stay empty. You should land on <b>/14days/thanks</b> and get mail from ClaimSaver+ with the PDF (needs RESEND_API_KEY on Vercel — already used for the live campaign).",
                "Download the checklist PDF. Confirm it is a self-help list, not a filing, and that the disclaimer is on the thanks page.",
                "Do not enter crash details, medical info, or a policy number — the form must not ask for them.",
            ],
            s,
        )
    )

    story.append(Paragraph("3. Sign in as OWNER and enroll MFA", s["h2"]))
    story.append(
        Paragraph(
            "Use <b>support@claimsaverplus.com</b> (the seeded OWNER). Password is the one you already set for that mailbox — it is not in this PDF.",
            s["body"],
        )
    )
    story.append(
        bullets(
            [
                "Go to <b>https://www.claimsaverplus.com/login?next=/admin</b>.",
                "First time: you are sent to <b>/admin/mfa</b>. Scan the QR in Authy / Google Authenticator / 1Password. Enter the 6-digit code. Staff access is aal2 (authenticator), not password-only.",
                "Idle timeout is 30 minutes. Absolute session is 12 hours. After either, you must enter a fresh code. Sidebar shows remaining idle time.",
                "If MFA ever loops, sign out, sign back in, then open /admin/mfa again before visiting /admin.",
            ],
            s,
        )
    )

    story.append(Paragraph("4. Admin console  ·  /admin  (this deploy)", s["h2"]))
    story.append(Paragraph("Overview", s["body"]))
    story.append(
        bullets(
            [
                "Header: “Staff manage the software, not a claimant's filing.” Email is masked (s***@…). Role OWNER.",
                "Counts: Accounts, Claim records (count only), Open tickets, Pending deletions, 14-day leads, Clinics, Staff seats.",
                "Yellow “Prohibited in this console” list is visible. System health: database connected, last audit event, messaging footer, retention years.",
            ],
            s,
        )
    )
    story.append(Paragraph("Clinics / BAA  ·  /admin/clinics", s["body"]))
    story.append(
        bullets(
            [
                "Open <b>Palm Grove Rehab LLC</b> (test pilot). BAA should read SIGNED and enrollment open — or set BAA to SIGNED, tick active, save.",
                "Try the inverse once: BAA not signed + active/open. Save should fail. Enrollment cannot go live without a signed BAA.",
                "Copy the enrollment URL from the clinic page. In a private window, sign in as a <b>test claimant</b> and open that /enroll/[code] link. Confirm the page says you remain the filer and the worksheet is not sent to the clinic. Enroll. Back on the clinic page, you should see checklist <b>progress</b> (step / status) only — no worksheet JSON, no documents, no medical details.",
                "Invite a clinic admin only if you have a throwaway email. They land on <b>/clinic</b>, not /admin.",
            ],
            s,
        )
    )

    story.append(PageBreak())
    story.append(Paragraph("Users, reveal, impersonation  ·  /admin/users", s["h2"]))
    story.append(
        bullets(
            [
                "Search a test claimant by <b>exact email</b>. Partial names should return nothing useful.",
                "Open the user. Email / phone / name stay masked until you pick a reveal reason (billing dispute, lockout, legal request, other) and click reveal. That writes an audit row with the reason, not the secret.",
                "Confirm you see claim <b>record count</b>, purchases, consents, tickets — not the worksheet body.",
                "<b>Impersonation (two browsers):</b> On the user page, “Ask claimant to approve a 30-minute view.” Needs a ticket + reason + a fresh TOTP code. In the claimant browser, dashboard shows an amber banner: Support asked to view your account; they cannot change your filing. Click Allow. Back in admin, the session is 30 minutes and <b>read-only</b>. Try a POST (save a form) — it should 403. End the session from admin. Silent impersonation is not a button.",
            ],
            s,
        )
    )
    story.append(Paragraph("Support tickets  ·  /admin/support", s["body"]))
    story.append(
        bullets(
            [
                "Open a ticket. Banner: do not advise on a PIP claim. Replies email the claimant with an account/billing/technical footer. You remain the filer.",
                "If someone writes a claim-substance question, use the built-in macro (I can't advise…). Confirm the email actually arrives.",
            ],
            s,
        )
    )
    story.append(Paragraph("Privacy, audit, roles, system", s["body"]))
    story.append(
        bullets(
            [
                "<b>/admin/privacy</b> — schedule deletion only on a throwaway. Account disables now; hard-delete is 30 days later. Cancel if you do not want it to fire.",
                "As the same throwaway claimant, dashboard “Download my data” should produce JSON. Staff must not be able to download that payload from the console.",
                "<b>/admin/audit</b> — reveal, impersonation request, ticket reply, BAA change should appear. No worksheet contents in the log.",
                "<b>/admin/roles</b> — OWNER only. Do not promote a random user. Never self-promote from the UI (seed is scripts/seed-owner.ts only).",
                "<b>/admin/system</b> — retention years, cron note, emergency revoke. Do not click revoke unless you intend to lock the console.",
                "<b>/admin/pilots</b> — Palm Grove listed as PILOT if that flag is on.",
            ],
            s,
        )
    )

    story.append(Paragraph("5. Claimant product (spot-check only)", s["h2"]))
    story.append(
        bullets(
            [
                "Sign in as a test claimant with platform access. Dashboard, worksheet, vault, calendar still work. Admin work should not have changed those flows except the support-access banner and the optional data export.",
                "Paywall still holds on an unpaid test account.",
                "You stay the filer on every surface.",
            ],
            s,
        )
    )

    story.append(Paragraph("6. What must never appear", s["h2"]))
    story.append(
        bullets(
            [
                "No staff page that opens worksheet JSON, uploads, or medical details.",
                "No “assign this claimant to a clinic” broker control. Enrollment is claimant-initiated.",
                "No silent view of a dashboard. No bulk personal-data export for staff.",
                "Google should not index /admin, /clinic, or /enroll (robots.txt + noindex header).",
                "Do not share data with BLACKLINE or sister companies from this console.",
            ],
            s,
            numbered=False,
        )
    )

    story.append(Paragraph("7. Counsel still owns these", s["h2"]))
    story.append(
        bullets(
            [
                "BAA template and the SIGNED workflow (we store status; counsel confirms the agreement).",
                "Retention years (default 7) and FIPA / HIPAA-as-if handling.",
                "14-day checklist copy and the “statute discusses” framing before ads spend.",
                "Breach timelines in docs/incident-response.md.",
            ],
            s,
            numbered=False,
        )
    )

    story.append(Paragraph("8. Shareable films (local, not the website)", s["h2"]))
    story.append(
        Paragraph(
            "These live on your laptop under <font face='Courier'>demo/film/</font>. They were not deployed.",
            s["body"],
        )
    )
    story.append(
        bullets(
            [
                "<b>claimsaver-plus-website.mp4</b> — 1:13 public site film.",
                "<b>claimsaver-plus-14days.mp4</b> — 0:55 campaign film.",
                "<b>claimsaver-plus-admin-console.mp4</b> — 1:21 console film (new voice).",
            ],
            s,
            numbered=False,
        )
    )

    story.append(Paragraph("Quick URL list", s["h2"]))
    rows = [
        [Paragraph("<b>Surface</b>", s["small"]), Paragraph("<b>URL</b>", s["small"])],
        [Paragraph("Home", s["item"]), Paragraph("https://www.claimsaverplus.com/", s["item"])],
        [Paragraph("14 DAYS.", s["item"]), Paragraph("https://www.claimsaverplus.com/14days", s["item"])],
        [Paragraph("14 DÍAS.", s["item"]), Paragraph("https://www.claimsaverplus.com/es/14dias", s["item"])],
        [Paragraph("14 JOURS.", s["item"]), Paragraph("https://www.claimsaverplus.com/fr/14jours", s["item"])],
        [Paragraph("Admin", s["item"]), Paragraph("https://www.claimsaverplus.com/admin", s["item"])],
        [Paragraph("Clinic", s["item"]), Paragraph("https://www.claimsaverplus.com/clinic", s["item"])],
        [Paragraph("How it works", s["item"]), Paragraph("https://www.claimsaverplus.com/how-it-works", s["item"])],
        [Paragraph("Pricing", s["item"]), Paragraph("https://www.claimsaverplus.com/pricing", s["item"])],
    ]
    table = Table(rows, colWidths=[1.6 * inch, 5.5 * inch])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), HexColor("#ecfdf5")),
                ("TEXTCOLOR", (0, 0), (-1, 0), TEAL_DARK),
                ("GRID", (0, 0), (-1, -1), 0.3, LINE),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    story.append(table)
    story.append(Spacer(1, 14))
    story.append(
        Paragraph(
            "If something fails, note the URL, the account (OWNER vs claimant vs clinic), and whether a worksheet was visible. Worksheet visible on a staff page is a stop-ship.",
            s["small"],
        )
    )

    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    print(f"Wrote {DEST}")


if __name__ == "__main__":
    build()
