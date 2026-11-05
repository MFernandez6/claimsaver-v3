"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { endSession } from "@/lib/auth/session-security";
import { isSupabaseBrowserConfigured } from "@/lib/supabase/env-public";
import { can, type Permission, type StaffRole } from "@/lib/auth/permissions";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { webApi } from "@/lib/api/client";

const NAV: { href: string; label: string; permission: Permission }[] = [
  { href: "/admin", label: "Overview", permission: "admin.overview" },
  { href: "/admin/leads", label: "Leads", permission: "admin.overview" },
  { href: "/admin/users", label: "Users", permission: "users.search" },
  { href: "/admin/support", label: "Support", permission: "support.tickets" },
  { href: "/admin/clinics", label: "Clinics", permission: "clinics.manage" },
  { href: "/admin/pilots", label: "Pilots", permission: "clinics.manage" },
  { href: "/admin/privacy", label: "Privacy", permission: "privacy.deletion.view" },
  { href: "/admin/audit", label: "Audit", permission: "audit.read" },
  { href: "/admin/roles", label: "Roles", permission: "roles.assign" },
  { href: "/admin/system", label: "System", permission: "admin.overview" },
];

function navActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({
  role,
  pathname,
  onNavigate,
  large,
}: {
  role: StaffRole;
  pathname: string;
  onNavigate?: () => void;
  large?: boolean;
}) {
  return (
    <nav className={cn("flex-1 space-y-1 overflow-y-auto p-3", large && "space-y-1.5 p-3")}>
      {NAV.filter((item) => can(role, item.permission)).map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "block rounded-lg px-3 font-medium text-slate-300 hover:bg-slate-800 hover:text-white",
            large ? "py-3.5 text-base" : "py-2 text-sm",
            navActive(pathname, item.href) && "bg-teal-950 text-teal-100",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function AdminShell({
  role,
  children,
}: {
  role: StaffRole;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [idleLabel, setIdleLabel] = useState("30m idle");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    document.getElementById("admin-nav-active")?.scrollIntoView({
      inline: "center",
      block: "nearest",
    });
  }, [pathname]);

  useEffect(() => {
    const tick = async () => {
      try {
        const session = await webApi.get<{
          idleRemainingMs: number;
          impersonating?: boolean;
        }>("/api/v1/admin/session");
        const mins = Math.max(1, Math.ceil(session.idleRemainingMs / 60000));
        setIdleLabel(
          session.impersonating ? "read-only support view" : `${mins}m idle left`,
        );
      } catch {
        setIdleLabel("session");
      }
    };
    void tick();
    const timer = window.setInterval(() => void tick(), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const signOut = async () => {
    if (isSupabaseBrowserConfigured()) await endSession("manual");
    window.location.href = "/login?next=/admin";
  };

  const links = NAV.filter((item) => can(role, item.permission));
  const current = links.find((item) => navActive(pathname, item.href));

  return (
    <div className="flex h-full min-h-0 flex-col lg:flex-row">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-800 bg-slate-950 px-3 py-2.5 pt-[max(0.65rem,env(safe-area-inset-top))] text-slate-100 lg:hidden">
        <div className="min-w-0">
          <BrandLogo variant="footer" className="[&_img]:h-7 [&_img]:max-w-[148px]" />
          <p className="truncate text-sm font-semibold text-white">
            {current?.label ?? "Admin"}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-700 text-slate-100"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      <nav
        className="flex shrink-0 gap-1.5 overflow-x-auto border-b border-slate-800 bg-slate-950 px-3 py-2 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Admin sections"
      >
        {links.map((item) => {
          const active = navActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              id={active ? "admin-nav-active" : undefined}
              href={item.href}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-2 text-sm font-medium",
                active ? "bg-teal-700 text-white" : "bg-slate-800 text-slate-200",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col bg-slate-950 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] text-slate-100 shadow-xl">
            <div className="border-b border-slate-800 px-4 py-4">
              <BrandLogo variant="footer" className="mb-3" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-300">
                Admin console
              </p>
            </div>
            <NavLinks
              role={role}
              pathname={pathname}
              onNavigate={() => setMenuOpen(false)}
              large
            />
            <div className="space-y-2 border-t border-slate-800 p-4">
              <Badge variant="outline" className="border-teal-700 text-teal-200">
                {role} · {idleLabel}
              </Badge>
              <Button
                type="button"
                variant="outline"
                className="w-full border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800"
                onClick={() => void signOut()}
              >
                Sign out
              </Button>
            </div>
          </aside>
        </div>
      ) : null}

      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950 text-slate-100 lg:flex">
        <div className="border-b border-slate-800 px-4 py-4">
          <BrandLogo variant="footer" className="mb-3" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-300">
            Admin console
          </p>
        </div>
        <NavLinks role={role} pathname={pathname} />
        <div className="space-y-2 border-t border-slate-800 p-4">
          <Badge variant="outline" className="border-teal-700 text-teal-200">
            {role} · {idleLabel}
          </Badge>
          <Button
            type="button"
            variant="outline"
            className="w-full border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800"
            onClick={() => void signOut()}
          >
            Sign out
          </Button>
        </div>
      </aside>

      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 pb-[max(1rem,env(safe-area-inset-bottom))] text-slate-900">
        {children}
      </div>
    </div>
  );
}
