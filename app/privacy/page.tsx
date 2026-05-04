import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for AI Cost Calc. We do not collect personal data. Analytics is anonymous and aggregate.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="2026-05-04">
      <p>
        This Privacy Policy describes how AI Cost Calc (&quot;we&quot;, &quot;us&quot;,
        or the &quot;Site&quot;) handles information when you visit{" "}
        <strong>aicostcalc.net</strong>. We have designed this site to collect as little
        personal information as possible.
      </p>

      <h2>Information we do not collect</h2>
      <p>
        We do <strong>not</strong> require account registration, and we do not collect:
      </p>
      <ul>
        <li>Names, email addresses, phone numbers, or postal addresses</li>
        <li>Payment information</li>
        <li>API keys or any data you enter into the calculator</li>
        <li>Content of conversations, prompts, or model outputs</li>
      </ul>
      <p>
        All calculations performed by the calculator happen entirely in your browser.
        Token counts, model selections, and cost figures are never transmitted to our
        servers.
      </p>

      <h2>Information automatically collected</h2>
      <p>We use third-party analytics services to understand aggregate site usage:</p>
      <ul>
        <li>
          <strong>Google Analytics 4</strong> — collects anonymized usage signals
          (pages viewed, approximate location at country level, device type, referrer)
          via cookies. No personally identifying information is sent.
        </li>
      </ul>
      <p>
        We use this data only to improve the tool and content. We do not sell or share
        it with third parties.
      </p>

      <h2>Cookies</h2>
      <p>
        This site uses cookies for two purposes:
      </p>
      <ul>
        <li>
          <strong>Theme preference</strong> — a small cookie remembers whether you have
          chosen light or dark mode.
        </li>
        <li>
          <strong>Analytics</strong> — Google Analytics sets cookies as described above.
        </li>
      </ul>
      <p>
        You can disable cookies in your browser settings without losing core
        functionality of the calculator.
      </p>

      <h2>Affiliate links</h2>
      <p>
        Some outbound links on this site may be affiliate links. If you click such a
        link and subsequently make a purchase, we may earn a commission at no extra
        cost to you. Affiliate links are clearly labeled where present, and they do not
        affect prices or recommendations.
      </p>

      <h2>Outbound links</h2>
      <p>
        This site links to third-party websites (provider pricing pages, GitHub,
        documentation, etc.). We are not responsible for the privacy practices of those
        sites. We encourage you to read their privacy policies independently.
      </p>

      <h2>Children&apos;s privacy</h2>
      <p>
        This site is intended for developers and technical professionals. We do not
        knowingly collect information from children under 13.
      </p>

      <h2>Your rights (GDPR / CCPA)</h2>
      <p>
        If you are in the EU, UK, or California, you have rights to access, correct,
        and delete personal data we hold about you. Because we do not collect
        personally identifying information in the first place, in practice this means
        you can:
      </p>
      <ul>
        <li>Request that we describe what data (if any) we hold about you</li>
        <li>Opt out of analytics tracking by enabling Do Not Track or using a blocker</li>
      </ul>
      <p>
        Contact us via the <a href="/contact">contact page</a> for any privacy request.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this Privacy Policy as the site evolves. Material changes will be
        announced on this page with an updated &quot;Last updated&quot; date.
      </p>
    </LegalPage>
  );
}
