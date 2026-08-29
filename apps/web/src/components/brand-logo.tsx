import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  /** Navbar default; footer uses the on-dark lockup; hero is larger; print stays dark-on-light. */
  variant?: "navbar" | "footer" | "hero" | "print";
};

const VARIANT_CLASS = {
  navbar: "h-9 w-auto max-w-[200px]",
  footer: "h-11 w-auto max-w-[240px]",
  hero: "h-auto w-[min(32rem,88vw)] max-w-full",
  print: "h-10 w-auto max-w-[200px]",
} as const;

const LOCKUP = {
  light: "/images/brand/claimsaver-plus-lockup.png",
  dark: "/images/brand/claimsaver-plus-lockup-on-dark.png",
} as const;

/**
 * Official ClaimSaver+ lockup (hexagonal CS+ mark + wordmark).
 * Light lockup for white surfaces; on-dark lockup when the background is dark.
 */
export function BrandLogo({
  className = "",
  variant = "navbar",
}: BrandLogoProps) {
  const sizeClass = VARIANT_CLASS[variant];
  const imgClass = `${sizeClass} object-contain object-left`;
  const forceDark = variant === "footer";
  const forceLight = variant === "print";
  const priority = variant === "navbar" || variant === "hero" || variant === "print";

  return (
    <span className={`inline-flex items-center ${className}`} role="img" aria-label="ClaimSaver+">
      {forceDark ? null : (
        <Image
          src={LOCKUP.light}
          alt=""
          width={592}
          height={144}
          className={`${imgClass} ${forceLight ? "" : "dark:hidden"}`}
          priority={priority}
        />
      )}
      {forceLight ? null : (
        <Image
          src={LOCKUP.dark}
          alt=""
          width={592}
          height={144}
          className={`${imgClass} ${forceDark ? "" : "hidden dark:block"}`}
          priority={priority}
        />
      )}
    </span>
  );
}
