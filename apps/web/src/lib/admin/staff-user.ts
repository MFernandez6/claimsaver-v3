import { maskEmail, maskName, maskPhone } from "@/lib/auth/mask";

export type ProfileRow = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  is_active: boolean;
  has_platform_access: boolean;
  created_at: string;
};

export type RevealFields = {
  email?: boolean;
  phone?: boolean;
  name?: boolean;
};

export function fullName(row: Pick<ProfileRow, "first_name" | "last_name">): string {
  return `${row.first_name} ${row.last_name}`.trim();
}

export function toStaffUserCard(row: ProfileRow, revealed: RevealFields = {}) {
  const name = fullName(row);
  return {
    id: row.id,
    email: revealed.email ? row.email : maskEmail(row.email),
    name: revealed.name ? name || "—" : maskName(name || "Unknown"),
    phone: revealed.phone ? row.phone || "—" : maskPhone(row.phone || ""),
    isActive: row.is_active,
    hasPlatformAccess: row.has_platform_access,
    createdAt: row.created_at,
    revealed: {
      email: Boolean(revealed.email),
      phone: Boolean(revealed.phone),
      name: Boolean(revealed.name),
    },
  };
}

export const PROFILE_COLUMNS =
  "id, email, first_name, last_name, phone, is_active, has_platform_access, created_at" as const;
