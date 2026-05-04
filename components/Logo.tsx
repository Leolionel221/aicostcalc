import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Logo mark size in px (default 28) */
  size?: number;
}

/**
 * AI Cost Calc brand mark.
 *
 * A descending chevron with a single accent dot at the convergence point.
 * Visual metaphor: cost descending toward the optimal (cheapest) endpoint.
 *
 * Design philosophy:
 * - Restraint: one geometric element, not a busy chart icon
 * - Premium palette: deep slate (not bright blue) with single emerald accent
 * - Mathematical: chevron suggests "minimum" / "convergence"
 * - Scales: legible from 16px favicon to 1200x630 OG image
 */
export function LogoMark({ className, size = 28 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Container: deep slate */}
      <rect width="40" height="40" rx="8" fill="#0F172A" />
      {/* Subtle highlight at top — gives depth without using actual gradients
          (avoids SVG <defs> id collisions when rendered multiple times in SSR) */}
      <rect width="40" height="20" rx="8" fill="white" fillOpacity="0.04" />
      {/* Chevron: descending, soft white */}
      <path
        d="M12 15.5 L20 24 L28 15.5"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Convergence point: small emerald accent dot */}
      <circle cx="20" cy="29.5" r="1.7" fill="#10B981" />
    </svg>
  );
}

/**
 * Brand mark + wordmark side-by-side. Used in Nav.
 */
export function Logo({ className, size = 28 }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoMark size={size} />
      <span className="font-semibold tracking-tight">AI Cost Calc</span>
    </div>
  );
}
