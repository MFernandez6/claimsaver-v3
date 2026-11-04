"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

export function AdminShell({
  role,
  children,
}: {
  role: StaffRole;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [idleLabel, setIdleLabel] = useState("30m idle");

  useEffect(() => {
    let timer: number | undefined;
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
    timer = window.setInterval(() => void tick(), 60_000);
    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, []);

  const signOut = async () => {
    if (isSupabaseBrowserConfigured()) await endSession("manual");
    window.location.href = "/login?next=/admin";
  };

  return (
    <div className="flex h-full min-h-0">
      <aside className="flex w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950 text-slate-100">
        <div className="border-b border-slate-800 px-4 py-4">
          <BrandLogo variant="footer" className="mb-3" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-300">
            Admin console
          </p>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.filter((item) => can(role, item.permission)).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white",
                navActive(pathname, item.href) && "bg-teal-950 text-teal-100",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-2 border-t border-slate-800 p-4">
          <Badge
            variant="outline"
            className="border-teal-700 text-teal-200"
          >
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
      <div className="min-w-0 flex-1 overflow-auto bg-slate-50 text-slate-900">
        {children}
      </div>
    </div>
  );
}
