/** Server-authoritative catalog. Clients send product codes, never dollar amounts. */

export const CURRENCY = "usd" as const;

export const PRODUCT_CODES = ["platform", "notarization"] as const;
export type ProductCode = (typeof PRODUCT_CODES)[number];

export const PRODUCTS = {
  platform: {
    code: "platform" as const,
    name: "Guided Claim Platform",
    description:
      "Access to guided PIP forms, secure document storage, tracking, and reminders. You remain the filer.",
    amountCents: 50_000,
    displayPrice: "$500.00",
    required: true,
  },
  notarization: {
    code: "notarization" as const,
    name: "Online notarization",
    description:
      "Optional remote document notarization via DocuSign. Not part of guided PIP filing.",
    amountCents: 2_500,
    displayPrice: "$25.00",
    required: false,
  },
} as const;

export const ILLUSTRATIVE_PIP_LIMIT_CENTS = 1_000_000;
export const ILLUSTRATIVE_CONTINGENCY_RATE = 0.33;
export const ILLUSTRATIVE_CONTINGENCY_FEE_CENTS = 330_000;
export const ILLUSTRATIVE_SAVINGS_CENTS =
  ILLUSTRATIVE_CONTINGENCY_FEE_CENTS - PRODUCTS.platform.amountCents;

export function isProductCode(value: string): value is ProductCode {
  return (PRODUCT_CODES as readonly string[]).includes(value);
}
