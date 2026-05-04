import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Logo mark size in px (default 28) */
  size?: number;
}

/**
 * AI Cost Calc brand mark.
 *
 * A forward-pointing chevron with a single accent dot at the destination.
 * Visual metaphor: forward motion toward the answer / target / cheapest pick.
 *
 * Design philosophy:
 * - Restraint: one geometric element, not a busy chart icon
 * - Premium palette: deep slate (not bright blue) with single emerald accent
 * - Active: chevron suggests "next" / "play" / "find your answer"
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
      {/* Chevron: forward-pointing, soft white */}
      <path
        d="M15.5 12 L24 20 L15.5 28"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Destination point: small emerald accent dot */}
      <circle cx="29.5" cy="20" r="1.7" fill="#10B981" />
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
