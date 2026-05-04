import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact AI Cost Calc — corrections, partnerships, feedback, and bug reports welcome.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <LegalPage title="Contact" lastUpdated="2026-05-04">
      <p>
        Reach out for any of the following — all replies come from a real person.
      </p>

      <h2>Pricing data correction</h2>
      <p>
        Spotted stale or incorrect pricing? We aim to update on the 1st of each month
        but providers change prices anytime. The fastest path to a fix:
      </p>
      <ul>
        <li>
          <strong>Open a GitHub issue</strong> at{" "}
          <a
            href="https://github.com/Leolionel221/aicostcalc/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/Leolionel221/aicostcalc/issues
          </a>
          {" "}— include the model, the wrong figure, and a link to the official page.
        </li>
        <li>
          Or email <strong>leochen221@proton.me</strong> with subject{" "}
          <code>Pricing correction: [model name]</code>.
        </li>
      </ul>

      <h2>Bug reports and feature requests</h2>
      <p>
        GitHub issues are preferred for anything technical — they&apos;re trackable and
        public. Pull requests welcome.
      </p>

      <h2>Partnerships and inquiries</h2>
      <p>
        Affiliate / sponsorship / data licensing / custom integration: email{" "}
        <strong>leochen221@proton.me</strong> with subject <code>Partnership</code>.
      </p>

      <h2>Press and media</h2>
      <p>
        For interviews, citations, or media inquiries: same email,{" "}
        <code>Press</code> in the subject line.
      </p>

      <h2>Privacy and legal</h2>
      <p>
        Privacy requests, takedown notices, or other legal correspondence:{" "}
        <strong>leochen221@proton.me</strong> with subject <code>Legal</code>.
      </p>

      <h2>Response time</h2>
      <p>
        I aim to respond within 2 business days. Pricing corrections are usually
        deployed within 24 hours of verification.
      </p>
    </LegalPage>
  );
}
