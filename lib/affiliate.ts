// Affiliate partner registry — single source of truth for monetization links.
//
// Rules (PRD §6.2 + FTC + Google link-scheme compliance):
// 1. Every affiliate link MUST render with rel="sponsored noopener noreferrer"
// 2. Every placement MUST show a visible "Affiliate link" disclosure
// 3. Never claim a partner hosts a model it doesn't actually serve

export interface AffiliatePartner {
  id: string;
  name: string;
  /** Base referral URL (already contains the ref code). */
  url: string;
}

export const NOVITA: AffiliatePartner = {
  id: "novita",
  name: "Novita AI",
  // 10% commission on referred users' spend, first 180 days.
  url: "https://novita.ai/?ref=mjgzzjc8&utm_source=affiliate",
};

// AIMLAPI (up to 30% lifetime, cash via Rewardful) — application pending.
// Add here once approved and swap into AffiliateCTA as the primary
// partner for proprietary-model pages (it serves 300+ models incl. OpenAI/Anthropic).
// export const AIMLAPI: AffiliatePartner = { id: "aimlapi", name: "AI/ML API", url: "..." };

/**
 * Whether Novita actually hosts this provider's models.
 * Novita serves open-weight families (DeepSeek, Llama, Qwen, Kimi, GLM...).
 * It does NOT serve proprietary APIs (OpenAI, Anthropic, Google, xAI).
 */
export function novitaServes(providerId: string): boolean {
  return providerId === "deepseek";
}

/** Referral URL with placement tag for conversion attribution. */
export function novitaUrl(placement: string): string {
  return `${NOVITA.url}&utm_content=${encodeURIComponent(placement)}`;
}
