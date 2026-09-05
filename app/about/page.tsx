import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "About",
  description:
    "AI Cost Calc is a free tool to compare API pricing across major LLM providers. Independently maintained, prices verified daily against the LiteLLM registry.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <LegalPage title="About AI Cost Calc" lastUpdated="2026-05-04">
      <p>
        <strong>AI Cost Calc</strong> is a free, independent tool that helps developers
        and teams calculate and compare API pricing across the major LLM providers —
        OpenAI, Anthropic, Google, DeepSeek, xAI, Mistral, and more.
      </p>

      <h2>Why this exists</h2>
      <p>
        AI API pricing has become genuinely complex. Beyond the headline input/output
        rates, modern providers offer prompt caching (often 10x cheaper), Batch API
        discounts (typically 50% off), reasoning tokens, vision tokens, fine-tuned
        pricing tiers, and more. A simple "$X per 1M tokens" calculation now misses
        most of the real cost picture.
      </p>
      <p>
        This calculator is built to surface those dimensions in one place — so you can
        see what you'd actually pay, not what the marketing pages imply.
      </p>

      <h2>How it's different</h2>
      <ul>
        <li>
          <strong>10+ models from 6 providers</strong>, with comparable per-call cost
          calculations side-by-side.
        </li>
        <li>
          <strong>Caching and batch pricing</strong> built into the calculator from day
          one — not as an afterthought.
        </li>
        <li>
          <strong>Exact tokenization</strong> for OpenAI models via official tiktoken
          encoders. Other providers use transparent character-ratio estimates labeled
          accordingly.
        </li>
        <li>
          <strong>Multiple currencies</strong> (USD, CNY, EUR, GBP, INR) for global
          budget framing — though all AI APIs are billed in USD.
        </li>
        <li>
          <strong>Monthly forecasts</strong> for high-volume workloads, with savings
          highlighted automatically.
        </li>
      </ul>

      <h2>How we maintain accuracy</h2>
      <p>
        Pricing is refreshed on the 1st of each month against each provider's official
        pricing page. Each model entry includes a <code>lastVerified</code> date and a
        link to the source. If you spot stale or incorrect data, please reach out —
        accuracy is the only thing this tool has going for it.
      </p>

      <h2>What this is not</h2>
      <ul>
        <li>
          <strong>Not affiliated with any AI provider.</strong> Provider names and
          logos are trademarks of their respective owners.
        </li>
        <li>
          <strong>Not a billing system.</strong> Numbers are estimates for planning;
          your actual provider invoice is authoritative.
        </li>
        <li>
          <strong>Not a benchmark.</strong> We do not rank model quality — only cost.
          Cost without capability matching is meaningless.
        </li>
      </ul>

      <h2>Built openly</h2>
      <p>
        The full source code is{" "}
        <a
          href="https://github.com/Leolionel221/aicostcalc"
          target="_blank"
          rel="noopener noreferrer"
        >
          available on GitHub
        </a>
        . Issues, corrections, and feature suggestions are welcome.
      </p>

      <h2>Contact</h2>
      <p>
        Questions, corrections, or partnership inquiries:{" "}
        <a href="/contact">visit the contact page</a>.
      </p>
    </LegalPage>
  );
}
