import { useId } from "react";

type BrandLogoProps = {
  className?: string;
  /** Navbar default; footer uses larger */
  variant?: "navbar" | "footer";
};

const VARIANT_CLASS = {
  navbar: "h-9 w-auto max-w-[200px]",
  footer: "h-11 w-auto max-w-[220px]",
} as const;

const VARIANT_TEXT = {
  navbar: "text-slate-900 dark:text-white",
  footer: "text-white",
} as const;

/**
 * Inline SVG wordmark: shield + check (protection, completion) and teal “+”.
 * Text uses currentColor for the nav/footer.
 */
export function BrandLogo({
  className = "",
  variant = "navbar",
}: BrandLogoProps) {
  const uid = useId().replace(/:/g, "");
  const gradId = `brandLogoMarkGrad-${uid}`;
  const sizeClass = VARIANT_CLASS[variant];
  const textClass = VARIANT_TEXT[variant];

  return (
    <svg
      className={`${sizeClass} object-contain object-left ${textClass} ${className}`}
      viewBox="0 0 200 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="ClaimSaver+"
    >
      <defs>
        <linearGradient
          id={gradId}
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0f172a" />
          <stop offset="1" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      <title>ClaimSaver+</title>
      {/* Mark */}
      <rect width="32" height="32" rx="8" fill={`url(#${gradId})`} />
      <path
        d="M9.5 16.5l4.2 4.2L22.5 11"
        stroke="#0d9488"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Wordmark — ClaimSaver uses theme text; + stays teal */}
      <text
        x="40"
        y="24.5"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontSize="15"
        fontWeight="700"
        letterSpacing="-0.02em"
      >
        <tspan fill="currentColor">ClaimSaver</tspan>
        <tspan fill="#0d9488">+</tspan>
      </text>
    </svg>
  );
}
