#!/usr/bin/env python3
"""Pocket PDF of every ClaimSaver+ URL ending."""
from __future__ import annotations

from pathlib import Path

from reportlab.lib.colors import HexColor, white
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "docs" / "ClaimSaver-Plus-url-endings.pdf"

TEAL = HexColor("#0f766e")
TEAL_DARK = HexColor("#134e4a")
TEAL_BG = HexColor("#ecfdf5")
SLATE = HexColor("#0f172a")
MUTED = HexColor("#475569")
LINE = HexColor("#cbd5e1")
AMBER_BG = HexColor("#fff7ed")
AMBER = HexColor("#9a3412")
PAPER = HexColor("#f8fafc")
HOST = "https://www.claimsaverplus.com"
PAGE = landscape(letter)


def styles():
    base = getSampleStyleSheet()
    return {
        "kicker": ParagraphStyle(
            "kicker",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8,
            textColor=TEAL,
            spaceAfter=2,
        ),
        "h1": ParagraphStyle(
            "h1",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=16,
            leading=19,
            textColor=SLATE,
            spaceAfter=4,
        ),
        "lede": ParagraphStyle(
            "lede",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            textColor=MUTED,
            spaceAfter=6,
        ),
        "h2": ParagraphStyle(
            "h2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=10,
            leading=13,
            textColor=TEAL_DARK,
            spaceBefore=6,
            spaceAfter=2,
        ),
        "path": ParagraphStyle(
            "path",
            parent=base["Normal"],
            fontName="Courier-Bold",
            fontSize=7.5,
            leading=10,
            textColor=SLATE,
        ),
        "who": ParagraphStyle(
            "who",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=7.5,
            leading=10,
            textColor=MUTED,
        ),
        "what": ParagraphStyle(
            "what",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=7.5,
            leading=10,
            textColor=SLATE,
        ),
        "head": ParagraphStyle(
            "head",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=7.5,
            textColor=TEAL_DARK,
        ),
        "warn": ParagraphStyle(
            "warn",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            textColor=AMBER,
        ),
        "small": ParagraphStyle(
            "small",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8,
            leading=11,
            textColor=MUTED,
        ),
    }


def header_footer(canvas, doc):
    canvas.saveState()
    w, h = PAGE
    canvas.setFillColor(SLATE)
    canvas.rect(0, h - 32, w, 32, fill=1, stroke=0)
    canvas.setFillColor(TEAL)
    canvas.rect(0, h - 34, w, 3, fill=1, stroke=0)
    canvas.setFillColor(white)
    canvas.setFont("Helvetica-Bold", 9)
    canvas.drawString(0.5 * inch, h - 20, "ClaimSaver+")
    canvas.setFont("Helvetica", 8)
    canvas.drawRightString(w - 0.5 * inch, h - 20, "URL endings  ·  5 Nov 2026")
    canvas.setFillColor(LINE)
    canvas.rect(0, 0, w, 24, fill=1, stroke=0)
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 7.5)
    canvas.drawString(0.5 * inch, 10, HOST)
    canvas.drawRightString(w - 0.5 * inch, 10, f"Page {doc.page}")
    canvas.restoreState()


def grid(rows: list[list], s, highlight=False, who=True):
    header = [
        Paragraph("Path", s["head"]),
        *( [Paragraph("Who", s["head"])] if who else [] ),
        Paragraph("What", s["head"]),
    ]
    data = [header]
    for row in rows:
        path, rest_who, what = (row[0], row[1], row[2]) if who else (row[0], "", row[1])
        cells = [Paragraph(path, s["path"])]
        if who:
            cells.append(Paragraph(rest_who, s["who"]))
        cells.append(Paragraph(what, s["what"]))
        data.append(cells)
    widths = [2.15 * inch, 1.55 * inch, 6.2 * inch] if who else [2.6 * inch, 7.3 * inch]
    table = Table(data, colWidths=widths, repeatRows=1)
    style = [
        ("BACKGROUND", (0, 0), (-1, 0), TEAL_BG),
        ("GRID", (0, 0), (-1, -1), 0.3, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 2.5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, PAPER]),
    ]
    if highlight:
        style.append(("BACKGROUND", (0, 1), (-1, -1), HexColor("#f0fdfa")))
    table.setStyle(TableStyle(style))
    return table


def callout(text: str, s):
    table = Table([[Paragraph(text, s["warn"])]], colWidths=[9.9 * inch])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), AMBER_BG),
                ("BOX", (0, 0), (-1, -1), 0.6, HexColor("#fdba74")),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return table


def build():
    s = styles()
    doc = SimpleDocTemplate(
        str(DEST),
        pagesize=PAGE,
        leftMargin=0.5 * inch,
        rightMargin=0.5 * inch,
        topMargin=0.55 * inch,
        bottomMargin=0.4 * inch,
        title="ClaimSaver+ URL endings",
        author="ClaimSaver+",
    )
    story = []
    story.append(Paragraph("ON HAND  ·  www.claimsaverplus.com", s["kicker"]))
    story.append(Paragraph("Every URL ending", s["h1"]))
    story.append(
        Paragraph(
            "Full address is the host plus the path, e.g. www.claimsaverplus.com/demo. "
            "Patients pay $499. Clinic dashboard price is quoted on the 15-minute demo — not listed publicly.",
            s["lede"],
        )
    )
    story.append(
        callout(
            "<b>Do not hand out a generic /enroll URL.</b> Each signed clinic gets its own "
            "/enroll/[code] from Admin → Clinics after the BAA is marked SIGNED. "
            "Canvassing = /demo. Explainer = /for-clinics.",
            s,
        )
    )

    story.append(Paragraph("Hand these out", s["h2"]))
    story.append(
        grid(
            [
                ["/demo", "Clinics", "Short 15-minute demo booking. Same page as /clinic-demo."],
                ["/clinic-demo", "Clinics", "Canonical canvassing URL. Book a 15-minute walkthrough."],
                ["/for-clinics", "Clinics", "Public explainer. Not a patient invite."],
                ["/enroll/[code]", "Referred patients", "Unique invite after BAA is SIGNED. Never print a generic enroll URL."],
                ["/14days", "Consumers", "14-day PIP checklist. Also /es/14dias and /fr/14jours."],
            ],
            s,
            highlight=True,
        )
    )

    story.append(Paragraph("Public marketing", s["h2"]))
    story.append(
        grid(
            [
                ["/", "Homepage"],
                ["/how-it-works", "Product walkthrough. Patient stays the filer."],
                ["/pricing", "Patient checkout ($499). Clinic price discussed on the demo."],
                ["/who-we-are", "Company"],
                ["/license-credentials", "License & credentials"],
                [
                    "/learning-center",
                    "Education index. Articles: /how-to-file-pip-in-florida, /florida-pip-14-day-rule, /do-you-need-an-attorney, /pip-claim-documents-checklist, /common-pip-claim-mistakes.",
                ],
                ["/when-to-call-an-attorney", "Education, not intake"],
                ["/contact", "Platform support"],
                ["/data-handling", "Data handling summary"],
                ["/privacy-policy", "Privacy Policy"],
                ["/terms-of-service", "Terms of Service (current version 26.11.05.3)"],
                ["/accessibility", "Accessibility"],
                ["/14days/thanks", "14-day lead thank-you. Also /es/14dias/gracias, /fr/14jours/merci."],
            ],
            s,
            who=False,
        )
    )

    story.append(Paragraph("Patient product (signed in)", s["h2"]))
    story.append(
        grid(
            [
                ["/login", "Sign in"],
                ["/signup", "Create account"],
                ["/forgot-password", "Reset request"],
                ["/update-password", "Set new password"],
                ["/checkout-account", "Account before Stripe Checkout"],
                ["/success", "Post-payment"],
                ["/dashboard", "Patient home. OWNER/SUPPORT are sent to /admin."],
                ["/claim-form", "Guided PIP worksheet"],
            ],
            s,
            who=False,
        )
    )

    story.append(Paragraph("Clinic staff (signed in)", s["h2"]))
    story.append(
        grid(
            [
                [
                    "/clinic",
                    "CLINIC_ADMIN / CLINIC_STAFF",
                    "Progress only — never worksheet answers, vault files, or medical details.",
                ],
            ],
            s,
        )
    )

    story.append(Paragraph("Internal review (OWNER / SUPPORT)", s["h2"]))
    story.append(
        grid(
            [
                [
                    "/films",
                    "OWNER / SUPPORT",
                    "Promo films on your phone. Sign in first. Not indexed. Website, 14-days, demo-day 90s, admin console.",
                ],
            ],
            s,
        )
    )

    story.append(Paragraph("Admin console (OWNER / SUPPORT)", s["h2"]))
    story.append(
        grid(
            [
                ["/admin", "Overview"],
                ["/admin/mfa", "Staff email/SMS code after password"],
                ["/admin/leads", "14-day leads"],
                ["/admin/users", "User search (exact email or user ID)"],
                ["/admin/users/[id]", "User detail"],
                ["/admin/support", "Tickets — account/billing/technical only"],
                ["/admin/support/[id]", "Ticket detail"],
                ["/admin/clinics", "Clinics, BAA, enroll URL after SIGNED"],
                ["/admin/clinics/[id]", "Clinic detail"],
                ["/admin/pilots", "Pilot clinics"],
                ["/admin/privacy", "Deletion schedule"],
                ["/admin/audit", "Audit log"],
                ["/admin/roles", "Staff seats"],
                ["/admin/system", "System / emergency revoke"],
            ],
            s,
            who=False,
        )
    )

    story.append(Paragraph("Plumbing and old endings", s["h2"]))
    story.append(
        grid(
            [
                ["/auth/callback", "Supabase auth callback"],
                ["/demo", "Serves /clinic-demo (rewrite; the address bar can stay /demo)"],
                ["/what-we-do", "Redirects to /how-it-works"],
                ["/signin  /sign-in", "Redirects to /login"],
                ["/sign-up", "Redirects to /signup"],
                ["/need-professional-help", "Redirects to /when-to-call-an-attorney"],
                ["/notarization", "Redirects to /pricing"],
            ],
            s,
            who=False,
        )
    )

    story.append(Spacer(1, 8))
    story.append(
        Paragraph(
            "robots.txt blocks /admin, /clinic, /enroll/, and /films. Staff manage the software. "
            "The claimant stays the filer. Not a law firm.",
            s["small"],
        )
    )

    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    print(f"Wrote {DEST}")


if __name__ == "__main__":
    build()
