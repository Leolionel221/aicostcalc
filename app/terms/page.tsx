import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of service for AI Cost Calc. Use the tool freely; pricing data is informational only.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="2026-05-04">
      <p>
        By accessing or using <strong>aicostcalc.net</strong> (the &quot;Site&quot;),
        you agree to the following terms. If you do not agree, please do not use the
        Site.
      </p>

      <h2>1. Use of the Site</h2>
      <p>
        AI Cost Calc is provided <strong>as a free tool</strong> for the purpose of
        helping you estimate and compare AI API pricing. You may use it for personal,
        educational, or commercial purposes without registration. You agree not to:
      </p>
      <ul>
        <li>Attempt to disrupt, overload, or compromise the Site</li>
        <li>Scrape the Site at a rate that interferes with normal operation</li>
        <li>Use automated means to manipulate analytics or rankings</li>
      </ul>
      <p>
        For automated programmatic access, we encourage using our public JSON endpoints
        instead of scraping the HTML pages.
      </p>

      <h2>2. No Warranty on Accuracy</h2>
      <p>
        Pricing data is provided <strong>for informational purposes only</strong>. We
        update pricing on the 1st of each month against official provider sources, but
        we cannot guarantee that data is current at any given moment. AI providers may
        change pricing at any time, and there may be a lag between such changes and
        their reflection here.
      </p>
      <p>
        <strong>
          Always verify pricing against the provider&apos;s official pricing page
          before making business decisions.
        </strong>{" "}
        Your provider invoice is the only authoritative source of what you actually
        pay.
      </p>

      <h2>3. Token Estimates</h2>
      <p>
        Token counts produced by the calculator are either:
      </p>
      <ul>
        <li>
          <strong>Exact</strong> — when using OpenAI models with the official tiktoken
          encoder.
        </li>
        <li>
          <strong>Estimated</strong> — when using other models, via character-ratio
          approximation. Estimates are typically within 10-20% of actual counts but may
          differ. Estimated values are clearly labeled with a &quot;~&quot; or
          &quot;Estimated&quot; tag.
        </li>
      </ul>

      <h2>4. No Liability</h2>
      <p>
        AI Cost Calc, its operators, and its contributors are not liable for any
        decisions made based on information presented on the Site, including but not
        limited to budget overruns, missed cost optimizations, or business decisions.
        Use this tool as one input among many.
      </p>

      <h2>5. Trademarks</h2>
      <p>
        Provider names (OpenAI, Anthropic, Google, DeepSeek, xAI, Mistral, etc.) and
        their logos are trademarks of their respective owners. We are not affiliated
        with, endorsed by, or sponsored by any AI provider. Use of provider names and
        logos is for descriptive identification only.
      </p>

      <h2>6. Affiliate and Sponsored Links</h2>
      <p>
        Some outbound links on this Site may be affiliate links. If you click such a
        link and make a purchase, we may earn a commission at no extra cost to you.
        Affiliate relationships do not influence which models are featured or how they
        are ranked — rankings are based solely on cost calculations.
      </p>

      <h2>7. Intellectual Property</h2>
      <p>
        The Site&apos;s code is open source under the repository linked from the
        footer. The pricing data structure is freely usable. Article and analysis
        content (when published in the blog) is © 2026 AI Cost Calc; you may quote
        excerpts with attribution and a link back, but please do not republish in
        full.
      </p>

      <h2>8. Termination</h2>
      <p>
        We reserve the right to remove or modify content, change features, or
        discontinue the Site at any time without notice.
      </p>

      <h2>9. Changes to These Terms</h2>
      <p>
        These Terms may be updated from time to time. Material changes will be flagged
        with an updated &quot;Last updated&quot; date.
      </p>

      <h2>10. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the jurisdiction in which the operator
        is registered. Any disputes will be resolved in courts of competent
        jurisdiction.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these Terms: <a href="/contact">visit the contact page</a>.
      </p>
    </LegalPage>
  );
}
