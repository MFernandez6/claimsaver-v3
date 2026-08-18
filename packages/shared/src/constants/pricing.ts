/** Server-authoritative catalog. Clients send product codes, never dollar amounts. */

export const CURRENCY = "usd" as const;

export const PRODUCT_CODES = ["platform", "notarization"] as const;
export type ProductCode = (typeof PRODUCT_CODES)[number];

/** Standard list price. Checkout uses `amountCents` while testing is on. */
export const PLATFORM_LIST_AMOUNT_CENTS = 50_000;
export const PLATFORM_LIST_DISPLAY_PRICE = "$500.00";

/**
 * Temporary production-testing rate. Set to `false` and restore `amountCents`
 * to `PLATFORM_LIST_AMOUNT_CENTS` before public launch.
 */
export const PLATFORM_PRICE_TESTING = true;

export const PRODUCTS = {
  platform: {
    code: "platform" as const,
    name: "Guided Claim Platform",
    description:
      "Access to guided PIP forms, secure document storage, tracking, and reminders. You remain the filer.",
    amountCents: PLATFORM_PRICE_TESTING ? 100 : PLATFORM_LIST_AMOUNT_CENTS,
    displayPrice: PLATFORM_PRICE_TESTING ? "$1.00" : PLATFORM_LIST_DISPLAY_PRICE,
    listAmountCents: PLATFORM_LIST_AMOUNT_CENTS,
    listDisplayPrice: PLATFORM_LIST_DISPLAY_PRICE,
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
  ILLUSTRATIVE_CONTINGENCY_FEE_CENTS - PLATFORM_LIST_AMOUNT_CENTS;

export function isProductCode(value: string): value is ProductCode {
  return (PRODUCT_CODES as readonly string[]).includes(value);
}

export function stripeProductDescription(code: ProductCode): string {
  const product = PRODUCTS[code];
  if (code === "platform" && PLATFORM_PRICE_TESTING) {
    return `${product.description} Production-testing rate of ${product.displayPrice}; that amount will be refunded after testing. Standard list price is ${PLATFORM_LIST_DISPLAY_PRICE}.`;
  }
  return product.description;
}
