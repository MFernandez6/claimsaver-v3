/** Server-authoritative catalog. Clients send product codes, never dollar amounts. */

export const CURRENCY = "usd" as const;

export const PRODUCT_CODES = ["platform", "notarization"] as const;
export type ProductCode = (typeof PRODUCT_CODES)[number];

/** Standard list price charged at checkout. */
export const PLATFORM_LIST_AMOUNT_CENTS = 50_000;
export const PLATFORM_LIST_DISPLAY_PRICE = "$500.00";

/** Public launch: always charge the list price. Keep the flag for a future private test window. */
export const PLATFORM_PRICE_TESTING = false;

/**
 * Temporary: skip Stripe and unlock the workspace so promo videos can be recorded.
 * Keep list prices on marketing pages. Set false and redeploy when filming is done.
 */
export const SKIP_PAYMENTS_FOR_PROMO = true;

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

/** Kept for internal math only—not used in customer-facing fee-off-PIP ads. */
export const ILLUSTRATIVE_PIP_LIMIT_CENTS = 1_000_000;

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
