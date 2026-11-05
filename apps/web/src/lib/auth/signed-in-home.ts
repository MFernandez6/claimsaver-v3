export type StaffHomeRole = "OWNER" | "SUPPORT" | null | undefined;

export type SignedInHome = {
  href: "/admin" | "/dashboard";
  labelKey: "navigation.adminConsole" | "navigation.dashboard";
};

export function isPlatformStaff(staffRole: StaffHomeRole): boolean {
  return staffRole === "OWNER" || staffRole === "SUPPORT";
}

/** Public-site destination for a signed-in account. Staff are not treated as paying clients. */
export function signedInHome(staffRole: StaffHomeRole): SignedInHome {
  if (isPlatformStaff(staffRole)) {
    return { href: "/admin", labelKey: "navigation.adminConsole" };
  }
  return { href: "/dashboard", labelKey: "navigation.dashboard" };
}

/** Keep an explicit next path; only replace the default client dashboard for staff. */
export function resolvePostLoginPath(requested: string, staffRole: StaffHomeRole): string {
  if (!isPlatformStaff(staffRole)) return requested;
  const path = requested.split("?")[0].split("#")[0];
  if (path === "/dashboard" || path === "/") return "/admin";
  return requested;
}
