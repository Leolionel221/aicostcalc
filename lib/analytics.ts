// Analytics event helper. See PRD v1.1 §6.2 for full event matrix.
// Events fire to gtag (GA4) when window.gtag is available; no-op otherwise.

/**
 * GA4 measurement ID — deliberately hardcoded, NOT an env var.
 *
 * This is not a secret: it ships in the page HTML for anyone to read.
 * Keeping it in code (rather than Vercel env) means the value is
 * version-controlled, visible in diffs, and can't silently drift from
 * what's deployed.
 *
 * History: 2026-08-24 — the previous ID (G-MMKJPWQWJD) went dead on
 * Google's side; googletagmanager.com returned 404 for it, so the gtag
 * library never executed and no hits were ever sent. Everything else
 * looked healthy (script tag present, dataLayer populated), which made
 * it hard to spot. Stream was recreated in the same property.
 *
 * BEFORE changing this, verify the ID actually serves a library:
 *   curl -s -o /dev/null -w "%{http_code} %{size_download}\n" \
 *     "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
 * Expect: 200 and ~500KB. A 404 / ~1.5KB means the ID is dead.
 */
export const GA_MEASUREMENT_ID = "G-2YK8KQ5K2N";

type EventName =
  | "calculator_used"
  | "model_selected"
  | "advanced_options_opened"
  | "caching_toggled"
  | "batch_toggled"
  | "currency_switched"
  | "scenario_template_selected"
  | "comparison_table_filtered"
  | "comparison_table_sorted"
  | "model_compared"
  | "monthly_estimator_used"
  | "model_landing_visited"
  | "affiliate_link_clicked"
  | "external_source_clicked"
  | "faq_expanded"
  | "language_switched"
  | "theme_toggled";

type EventParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (command: "event", action: string, params?: EventParams) => void;
    dataLayer?: unknown[];
  }
}

export function track(name: EventName, params?: EventParams): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  try {
    window.gtag("event", name, params);
  } catch {
    // Silent fail — analytics should never break the app.
  }
}

/**
 * Debounced tracker — useful for high-frequency events like calculator typing.
 * Returns a debounced fn keyed by name+params signature.
 */
const lastFireTimes = new Map<string, number>();

export function trackDebounced(
  name: EventName,
  params?: EventParams,
  windowMs = 2000,
): void {
  const key = name + JSON.stringify(params ?? {});
  const now = Date.now();
  const last = lastFireTimes.get(key) ?? 0;
  if (now - last < windowMs) return;
  lastFireTimes.set(key, now);
  track(name, params);
}
