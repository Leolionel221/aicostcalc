import modelsData from "@/data/models.json";
import type { ModelsData } from "@/lib/types";
import { buildChangeLog, changeTitle } from "@/lib/changes";
import { SITE } from "@/lib/seo";

// Built once per deploy. The daily sync commits data changes, which triggers a
// deploy, so the feed is exactly as fresh as the data — no runtime work.
export const dynamic = "force-static";

const data = modelsData as ModelsData;
const FEED_SIZE = 50;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** RFC 822 date at 12:00 UTC — the log records days, not times. */
const rfc822 = (ymd: string) => new Date(`${ymd}T12:00:00Z`).toUTCString();

export async function GET() {
  const events = buildChangeLog(data.models).slice(0, FEED_SIZE);
  const items = events
    .map((e) => {
      const link = `${SITE.url}${e.href}`;
      const title = changeTitle(e);
      return `    <item>
      <title>${esc(title)}</title>
      <link>${esc(link)}</link>
      <guid isPermaLink="false">aicostcalc:${e.modelId}:${e.kind}:${e.date}</guid>
      <pubDate>${rfc822(e.date)}</pubDate>
      <category>${esc(e.provider)}</category>
      <description>${esc(`${title}. Full pricing, caching and batch rates, and a cost calculator: ${link}`)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AI API price changes &amp; new models — AI Cost Calc</title>
    <link>${SITE.url}/changes</link>
    <atom:link href="${SITE.url}/changes/rss.xml" rel="self" type="application/rss+xml" />
    <description>New LLM API models and price changes across OpenAI, Anthropic, Google, DeepSeek, xAI and Mistral. Reconciled daily against the LiteLLM registry.</description>
    <language>en</language>
    <lastBuildDate>${rfc822(data.lastUpdated)}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
