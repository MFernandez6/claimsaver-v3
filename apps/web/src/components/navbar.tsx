"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CHECKOUT_PATH } from "@claimsaver/shared";
import { BrandLogo } from "@/components/brand-logo";
import LanguageSwitcher from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { useSupabaseUser } from "@/components/auth/use-supabase-user";
import { isSupabaseBrowserConfigured } from "@/lib/supabase/env-public";
import { endSession } from "@/lib/auth/session-security";
import { cn } from "@/lib/utils";

const PRIMARY = [
  { href: "/who-we-are", key: "whoWeAre" },
  { href: "/how-it-works", key: "howItWorks" },
  { href: "/pricing", key: "pricing" },
] as const;

const COMPANY = [
  { href: "/when-to-call-an-attorney", key: "needProfessionalHelp" },
  { href: "/learning-center", key: "learningCenter" },
  { href: "/contact", key: "contact" },
] as const;

export function Navbar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { user, isLoaded, isSignedIn } = useSupabaseUser();
  const [open, setOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const companyRef = useRef<HTMLDivElement>(null);

  const companyActive = COMPANY.some((l) => pathname === l.href || pathname.startsWith(`${l.href}/`));

  useEffect(() => {
    if (!companyOpen) return;
    function onPointerDown(event: PointerEvent) {
      if (!companyRef.current?.contains(event.target as Node)) {
        setCompanyOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setCompanyOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [companyOpen]);

  const signOut = async () => {
    if (!isSupabaseBrowserConfigured()) return;
    await endSession("manual");
    window.location.href = "/";
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-md print:hidden dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
          <BrandLogo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {PRIMARY.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-lg px-2.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-teal-800 dark:text-slate-300 dark:hover:bg-slate-800",
                pathname === l.href && "bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-200",
              )}
            >
              {t(`navigation.${l.key}`)}
            </Link>
          ))}
          <div className="relative" ref={companyRef}>
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-teal-800 dark:text-slate-300 dark:hover:bg-slate-800",
                companyActive && "bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-200",
              )}
              aria-expanded={companyOpen}
              aria-haspopup="menu"
              onClick={() => setCompanyOpen((v) => !v)}
            >
              {t("nav.company")}
              <ChevronDown className={cn("h-3.5 w-3.5 opacity-70 transition-transform", companyOpen && "rotate-180")} />
            </button>
            {companyOpen ? (
              <div className="absolute left-0 z-50 mt-1.5 min-w-[13rem] rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                {COMPANY.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setCompanyOpen(false)}
                    className={cn(
                      "block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800",
                      pathname === l.href && "bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-200",
                    )}
                  >
                    {t(`navigation.${l.key}`)}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {isLoaded && isSignedIn ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Button size="sm" asChild className="bg-gradient-to-r from-teal-600 to-teal-800">
                <Link href="/dashboard">{t("navigation.dashboard")}</Link>
              </Button>
              <Button size="sm" variant="outline" onClick={() => void signOut()}>
                {t("navigation.signOut")}
              </Button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button size="sm" variant="outline" asChild>
                <Link href="/login">{t("navigation.signIn")}</Link>
              </Button>
              <Button size="sm" asChild className="bg-gradient-to-r from-teal-600 to-teal-800">
                <Link href={CHECKOUT_PATH}>{t("navigation.getStarted")}</Link>
              </Button>
            </div>
          )}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={t("common.menu")}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 lg:hidden">
          <div className="flex flex-col gap-1">
            {PRIMARY.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                {t(`navigation.${l.key}`)}
              </Link>
            ))}
            <p className="mt-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">{t("nav.company")}</p>
            {COMPANY.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                {t(`navigation.${l.key}`)}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium">
                  {t("navigation.dashboard")}
                </Link>
                <button type="button" className="rounded-lg px-3 py-2 text-left text-sm text-red-600" onClick={() => void signOut()}>
                  {t("navigation.signOut")}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm">
                  {t("navigation.signIn")}
                </Link>
                <Link href={CHECKOUT_PATH} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-semibold text-teal-800">
                  {t("navigation.getStarted")}
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
