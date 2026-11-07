"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { START_PATH } from "@claimsaver/shared";
import { BrandLogo } from "@/components/brand-logo";
import LanguageSwitcher from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { useSignedInHome } from "@/components/auth/use-signed-in-home";
import { isSupabaseBrowserConfigured } from "@/lib/supabase/env-public";
import { endSession } from "@/lib/auth/session-security";
import { cn } from "@/lib/utils";

const PRIMARY = [
  { href: "/who-we-are", key: "whoWeAre" },
  { href: "/how-it-works", key: "howItWorks" },
  { href: "/pricing", key: "pricing" },
] as const;

const FOR_CLINICS = { href: "/for-clinics", key: "forClinics" } as const;

const COMPANY = [
  { href: "/when-to-call-an-attorney", key: "needProfessionalHelp" },
  { href: "/learning-center", key: "learningCenter" },
  { href: "/license-credentials", key: "licenseCredentials" },
  { href: "/contact", key: "contact" },
] as const;

const LINK_CLASS =
  "inline-flex items-center whitespace-nowrap rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-teal-800 dark:text-slate-300 dark:hover:bg-slate-800";

type BarMode = "full" | "compact" | "menu";

export function Navbar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { user, isLoaded, isSignedIn, home, staffReady } = useSignedInHome();
  const [open, setOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [mode, setMode] = useState<BarMode>("menu");
  const rowRef = useRef<HTMLDivElement>(null);
  const fullSizerRef = useRef<HTMLElement>(null);
  const compactSizerRef = useRef<HTMLElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const companyRef = useRef<HTMLDivElement>(null);

  const companyItems = mode === "full" ? COMPANY : [FOR_CLINICS, ...COMPANY];
  const companyActive = companyItems.some(
    (l) => pathname === l.href || pathname.startsWith(`${l.href}/`),
  );

  useEffect(() => {
    setOpen(false);
    setCompanyOpen(false);
  }, [pathname]);

  useEffect(() => {
    const row = rowRef.current;
    const full = fullSizerRef.current;
    const compact = compactSizerRef.current;
    const actions = actionsRef.current;
    if (!row || !full || !compact || !actions) return;

    const measure = () => {
      const logo = row.querySelector("[data-nav-logo]");
      const logoWidth = logo instanceof HTMLElement ? logo.offsetWidth : 0;
      const menuBtn = actions.querySelector("[data-nav-menu]");
      const menuWidth =
        menuBtn instanceof HTMLElement && getComputedStyle(menuBtn).display !== "none"
          ? menuBtn.offsetWidth + 8
          : 0;
      const available = row.clientWidth - logoWidth - (actions.offsetWidth - menuWidth) - 24;
      if (full.scrollWidth <= available) setMode("full");
      else if (compact.scrollWidth <= available) setMode("compact");
      else setMode("menu");
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    observer.observe(actions);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (mode !== "menu") setOpen(false);
  }, [mode]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open]);

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

  const close = () => setOpen(false);
  const showBar = mode !== "menu";

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-200/80 bg-white/85 pt-[env(safe-area-inset-top)] backdrop-blur-md print:hidden dark:border-slate-800 dark:bg-slate-950/80">
      <div ref={rowRef} className="relative mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" data-nav-logo className="shrink-0" onClick={close}>
          <BrandLogo />
        </Link>

        <NavSizer sizerRef={fullSizerRef} includeClinics />
        <NavSizer sizerRef={compactSizerRef} includeClinics={false} />

        <nav
          className={cn(
            "min-w-0 flex-1 items-center justify-end gap-0.5 overflow-hidden",
            showBar ? "flex" : "hidden lg:flex",
          )}
        >
          {PRIMARY.map((l) => (
            <NavLink key={l.href} href={l.href} active={pathname === l.href}>
              {t(`navigation.${l.key}`)}
            </NavLink>
          ))}
          {mode === "full" ? (
            <NavLink href={FOR_CLINICS.href} active={pathname === FOR_CLINICS.href}>
              {t(`navigation.${FOR_CLINICS.key}`)}
            </NavLink>
          ) : null}
          <CompanyMenu
            items={companyItems}
            open={companyOpen}
            active={companyActive}
            pathname={pathname}
            menuRef={companyRef}
            onToggle={() => setCompanyOpen((v) => !v)}
            onClose={() => setCompanyOpen(false)}
          />
        </nav>

        <div ref={actionsRef} className="ml-auto flex shrink-0 items-center gap-2">
          <LanguageSwitcher />
          {isLoaded && isSignedIn ? (
            <div className="hidden items-center gap-2 sm:flex">
              {staffReady ? (
                <Button size="sm" asChild className="bg-gradient-to-r from-teal-600 to-teal-800">
                  <Link href={home.href}>{t(home.labelKey)}</Link>
                </Button>
              ) : (
                <span className="inline-block h-8 w-28" aria-hidden />
              )}
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
                <Link href={START_PATH}>{t("navigation.getStarted")}</Link>
              </Button>
            </div>
          )}
          <button
            type="button"
            data-nav-menu
            className={cn(
              "inline-flex h-11 w-11 min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800",
              showBar ? "hidden" : "lg:hidden",
            )}
            onClick={() => setOpen((v) => !v)}
            aria-label={t("common.menu")}
            aria-expanded={open}
            aria-controls="site-menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && !showBar ? (
        <>
          <button
            type="button"
            className="fixed inset-x-0 bottom-0 top-16 z-30 bg-slate-950/40"
            aria-label={t("common.close")}
            onClick={close}
          />
          <div
            id="site-menu"
            className="absolute inset-x-0 top-full z-40 max-h-[min(32rem,calc(100dvh-4rem-env(safe-area-inset-top)))] overflow-y-auto border-t border-slate-200 bg-white px-4 py-4 shadow-lg dark:border-slate-800 dark:bg-slate-950 sm:px-6"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              {PRIMARY.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "rounded-lg px-3 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800",
                    pathname === l.href && "bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-200",
                  )}
                >
                  {t(`navigation.${l.key}`)}
                </Link>
              ))}
              <p className="mt-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {t("nav.company")}
              </p>
              {[FOR_CLINICS, ...COMPANY].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "rounded-lg px-3 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800",
                    pathname === l.href && "bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-200",
                  )}
                >
                  {t(`navigation.${l.key}`)}
                </Link>
              ))}
              {user ? (
                <div className="mt-2 flex flex-col gap-1 border-t border-slate-200 pt-2 dark:border-slate-800 sm:hidden">
                  <Link href={home.href} className="rounded-lg px-3 py-3 text-sm font-medium">
                    {t(home.labelKey)}
                  </Link>
                  <button
                    type="button"
                    className="rounded-lg px-3 py-3 text-left text-sm text-red-600"
                    onClick={() => void signOut()}
                  >
                    {t("navigation.signOut")}
                  </button>
                </div>
              ) : (
                <div className="mt-2 flex flex-col gap-1 border-t border-slate-200 pt-2 dark:border-slate-800 sm:hidden">
                  <Link href="/login" className="rounded-lg px-3 py-3 text-sm">
                    {t("navigation.signIn")}
                  </Link>
                  <Link href={START_PATH} className="rounded-lg px-3 py-3 text-sm font-semibold text-teal-800">
                    {t("navigation.getStarted")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}

function NavSizer({
  sizerRef,
  includeClinics,
}: {
  sizerRef: RefObject<HTMLElement | null>;
  includeClinics: boolean;
}) {
  const { t } = useTranslation();

  return (
    <nav
      ref={sizerRef}
      aria-hidden
      className="pointer-events-none invisible absolute left-0 top-0 -z-10 flex items-center gap-0.5 whitespace-nowrap"
    >
      {PRIMARY.map((l) => (
        <span key={l.href} className={LINK_CLASS}>
          {t(`navigation.${l.key}`)}
        </span>
      ))}
      {includeClinics ? <span className={LINK_CLASS}>{t(`navigation.${FOR_CLINICS.key}`)}</span> : null}
      <span className={cn(LINK_CLASS, "gap-1")}>
        {t("nav.company")}
        <ChevronDown className="h-3.5 w-3.5" />
      </span>
    </nav>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(LINK_CLASS, active && "bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-200")}
    >
      {children}
    </Link>
  );
}

function CompanyMenu({
  items,
  open,
  active,
  pathname,
  menuRef,
  onToggle,
  onClose,
}: {
  items: readonly { href: string; key: string }[];
  open: boolean;
  active: boolean;
  pathname: string;
  menuRef: RefObject<HTMLDivElement | null>;
  onToggle: () => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <button
        type="button"
        className={cn(
          LINK_CLASS,
          "gap-1",
          active && "bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-200",
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={onToggle}
      >
        {t("nav.company")}
        <ChevronDown className={cn("h-3.5 w-3.5 opacity-70 transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-1.5 min-w-[13rem] rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
        >
          {items.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              role="menuitem"
              onClick={onClose}
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
  );
}
