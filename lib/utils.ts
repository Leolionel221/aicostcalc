import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Context window for display: "922K", "1M", "1.05M".
 * `toFixed(0)}K` rendered a 1M window as "1000K", which reads as a mistake.
 */
export function formatContext(tokens: number): string {
  if (tokens >= 1_000_000) return `${Number((tokens / 1_000_000).toFixed(2))}M`;
  return `${Math.round(tokens / 1000)}K`;
}
