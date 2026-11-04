export const APP_ROLES = [
  "OWNER",
  "SUPPORT",
  "CLINIC_ADMIN",
  "CLINIC_STAFF",
  "CLAIMANT",
] as const;

export type AppRole = (typeof APP_ROLES)[number];

export const STAFF_ROLES = ["OWNER", "SUPPORT"] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];

/** Actions the admin console may grant. Later phases add UI; the map is the source of truth now. */
export const PERMISSIONS = [
  "admin.access",
  "admin.overview",
  "roles.assign",
  "audit.read",
  "users.search",
  "users.reveal",
  "users.disable",
  "privacy.deletion.view",
  "privacy.deletion.approve",
  "privacy.export",
  "support.tickets",
  "clinics.manage",
  "clinics.enroll",
  "impersonate.breakglass",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

/**
 * Never grant these. Encoded so tests fail if someone adds them to a role map.
 * The admin manages the software; the claimant stays the filer.
 */
export const PROHIBITED_PERMISSIONS = [
  "claims.read_content",
  "claims.edit",
  "claims.note",
  "claims.advise",
  "users.bulk_export",
  "data.share_blackline",
  "impersonate.silent",
  "medical.details.default",
] as const;

export type ProhibitedPermission = (typeof PROHIBITED_PERMISSIONS)[number];

const ROLE_PERMISSIONS: Record<AppRole, readonly Permission[]> = {
  OWNER: PERMISSIONS,
  SUPPORT: [
    "admin.access",
    "admin.overview",
    "users.search",
    "users.reveal",
    "privacy.deletion.view",
    "support.tickets",
    "impersonate.breakglass",
  ],
  CLINIC_ADMIN: ["clinics.manage", "clinics.enroll"],
  CLINIC_STAFF: ["clinics.enroll"],
  CLAIMANT: [],
};

const RANK: Record<AppRole, number> = {
  OWNER: 50,
  SUPPORT: 40,
  CLINIC_ADMIN: 30,
  CLINIC_STAFF: 20,
  CLAIMANT: 10,
};

export function isAppRole(value: unknown): value is AppRole {
  return typeof value === "string" && (APP_ROLES as readonly string[]).includes(value);
}

export function isStaffRole(value: unknown): value is StaffRole {
  return value === "OWNER" || value === "SUPPORT";
}

export function highestRole(roles: readonly AppRole[]): AppRole | null {
  let best: AppRole | null = null;
  for (const role of roles) {
    if (!best || RANK[role] > RANK[best]) best = role;
  }
  return best;
}

export function can(role: AppRole | null | undefined, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function canNever(permission: ProhibitedPermission): false {
  void permission;
  return false;
}

export function permissionsFor(role: AppRole): readonly Permission[] {
  return ROLE_PERMISSIONS[role];
}
