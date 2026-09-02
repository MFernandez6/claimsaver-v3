import { z } from "zod";
import { DOCUMENT_TYPES } from "../constants/legal";

export const documentRowSchema = z.object({
  id: z.string().uuid(),
  claimId: z.string().uuid().nullable(),
  name: z.string(),
  type: z.enum(DOCUMENT_TYPES),
  mimeType: z.string(),
  sizeBytes: z.number().int().nonnegative(),
  createdAt: z.string(),
});

export type DocumentRow = z.infer<typeof documentRowSchema>;

export const calendarEventSchema = z.object({
  id: z.string().uuid(),
  claimId: z.string().uuid().nullable(),
  title: z.string(),
  date: z.string(),
  time: z.string().default(""),
  type: z.enum(["appointment", "deadline", "follow-up", "payment", "custom"]),
  description: z.string().default(""),
  priority: z.enum(["low", "medium", "high"]),
  completed: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string().default(""),
});

export type CalendarEvent = z.infer<typeof calendarEventSchema>;

export const createCalendarEventSchema = z.object({
  claimId: z.string().uuid().nullable().optional(),
  title: z.string().min(1).max(200),
  date: z.string().min(1),
  time: z.string().default(""),
  type: z.enum(["appointment", "deadline", "follow-up", "payment", "custom"]),
  description: z.string().default(""),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

export const expenseSchema = z.object({
  id: z.string().uuid(),
  claimId: z.string().uuid().nullable(),
  category: z.enum(["medical", "wage", "mileage", "other"]),
  amountCents: z.number().int(),
  description: z.string(),
  incurredOn: z.string(),
  createdAt: z.string(),
});

export type ExpenseRow = z.infer<typeof expenseSchema>;

export const createExpenseSchema = z.object({
  claimId: z.string().uuid().nullable().optional(),
  category: z.enum(["medical", "wage", "mileage", "other"]),
  amountCents: z.number().int().nonnegative(),
  description: z.string().min(1).max(500),
  incurredOn: z.string().min(1),
});

export const checkoutRequestSchema = z.object({
  products: z.array(z.literal("platform")).min(1).max(1),
  successPath: z.string().optional(),
  cancelPath: z.string().optional(),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;

export const entitlementSchema = z.object({
  hasPlatformAccess: z.boolean(),
  hasNotarizationPurchase: z.boolean(),
});

export type Entitlement = z.infer<typeof entitlementSchema>;

export const meSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(["user", "admin", "super_admin"]),
  hasPlatformAccess: z.boolean(),
  legalConsentCurrent: z.boolean().default(true),
});

export type Me = z.infer<typeof meSchema>;
