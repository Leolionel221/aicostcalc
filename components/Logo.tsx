import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Logo mark size in px (default 28) */
  size?: number;
}

/**
 * AI Cost Calc brand mark.
 *
 * Three horizontal bars of decreasing length, signaling cost-ranked comparison
 * (cheapest on top, longest = winner in accent green). Wrapped in a primary-blue
 * rounded square. Renders crisply at any size from favicon (16px) to OG image
 * (1200x630).
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
      <rect width="40" height="40" rx="9" fill="#2563EB" />
      <rect x="8" y="11" width="24" height="3.5" rx="1.75" fill="#10B981" />
      <rect
        x="8"
        y="18"
        width="17"
        height="3.5"
        rx="1.75"
        fill="white"
        opacity="0.85"
      />
      <rect
        x="8"
        y="25"
        width="11"
        height="3.5"
        rx="1.75"
        fill="white"
        opacity="0.5"
      />
    </svg>
  );
}

/**
 * Brand mark + wordmark side-by-side. Used in Nav.
 */
export function Logo({
  className,
  size = 28,
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoMark size={size} />
      <span className="font-semibold tracking-tight">AI Cost Calc</span>
    </div>
  );
}
