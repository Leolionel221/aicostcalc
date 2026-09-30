#!/usr/bin/env node
/**
 * Push changed URLs to IndexNow (Bing, Yandex, Seznam, Naver, Yep…).
 *
 * Why: GA4 showed Bing-powered search (Bing + DuckDuckGo + Yahoo, ~100 sessions
 * in 90 days) sends five times the traffic Google does (19). New model pages
 * are published automatically, but nothing told any search engine they exist —
 * Google's Indexing API may not be used for ordinary pages, so they waited for
 * a sitemap recrawl. IndexNow is the sanctioned protocol for exactly this.
 *
 * Ownership is proven by public/<KEY>.txt containing KEY. The key is not a
 * secret — engines fetch it from the site — so it lives in the repo.
 *
 * Usage:
 *   node scripts/indexnow.mjs --diff <baseSha> <headSha>   URLs whose data changed between two commits
 *   node scripts/indexnow.mjs --all                        every URL in the model set + core pages
 *   node scripts/indexnow.mjs --urls <url> [<url>…]        explicit list
 *   add --dry-run to print without submitting
 *
 * Exit codes: 0 submitted (or nothing to submit), 1 IndexNow rejected, 2 usage/IO error.
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SITE = "https://aicostcalc.net";
const HOST = "aicostcalc.net";
const ENDPOINT = "https://api.indexnow.org/indexnow";

function findKey() {
  const pub = path.join(process.cwd(), "public");
  const files = fs.readdirSync(pub).filter((f) => /^[0-9a-f]{32}\.txt$/.test(f));
  if (files.length !== 1) throw new Error(`expected exactly one IndexNow key file in public/, found ${files.length}`);
  const key = files[0].slice(0, -4);
  const body = fs.readFileSync(path.join(pub, files[0]), "utf8").trim();
  if (body !== key) throw new Error(`public/${files[0]} must contain exactly its own name`);
  return key;
}

const slug = (id) => `${SITE}/${id}-cost-calculator`;
// Pages whose content is derived from the model set: when any model changes, these change too.
const DERIVED = ["/", "/changes", "/blog/top-10-cheapest-ai-apis-2026"].map((p) => SITE + (p === "/" ? "" : p));

function readModelsAt(sha) {
  const raw = execFileSync("git", ["show", `${sha}:data/models.json`], { encoding: "utf8", maxBuffer: 64 << 20 });
  return JSON.parse(raw).models;
}

/** Fields that change what a model page shows. `lastVerified` alone does not. */
const fingerprint = (m) =>
  JSON.stringify([m.name, m.status, m.deprecatedAt, m.successorId, m.pricing, m.limits, m.supports, m.i18n, !!m.draft]);

export function changedUrls(before, after) {
  const prev = new Map(before.map((m) => [m.id, fingerprint(m)]));
  const urls = [];
  for (const m of after) {
    if (prev.get(m.id) !== fingerprint(m)) urls.push(slug(m.id));
  }
  return urls.length ? [...urls, ...DERIVED] : [];
}

function allUrls() {
  const models = JSON.parse(fs.readFileSync("data/models.json", "utf8")).models;
  return [...DERIVED, `${SITE}/api`, ...models.map((m) => slug(m.id))];
}

async function submit(urls, key) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key, keyLocation: `${SITE}/${key}.txt`, urlList: urls }),
  });
  // 200 OK = accepted; 202 Accepted = accepted, key validation pending (normal for a new key).
  // 400 bad format, 403 key not found/invalid, 422 URLs don't belong to host, 429 too many requests.
  return { status: res.status, body: (await res.text()).slice(0, 300) };
}

async function main() {
  const args = process.argv.slice(2);
  const dry = args.includes("--dry-run");
  let urls;
  if (args[0] === "--diff" && args[1] && args[2]) {
    urls = changedUrls(readModelsAt(args[1]), readModelsAt(args[2]));
  } else if (args[0] === "--all") {
    urls = allUrls();
  } else if (args[0] === "--urls" && args.length > 1) {
    urls = args.slice(1).filter((a) => a.startsWith("http"));
  } else {
    console.error("usage: indexnow.mjs --diff <base> <head> | --all | --urls <url>…  [--dry-run]");
    process.exit(2);
  }

  urls = [...new Set(urls)];
  if (!urls.length) {
    console.log("No page-affecting data changes — nothing to submit.");
    return;
  }
  console.log(`${urls.length} URL(s):\n${urls.map((u) => `  ${u}`).join("\n")}`);
  if (dry) return console.log("\n(dry run — not submitted)");

  const key = findKey();
  const { status, body } = await submit(urls, key);
  console.log(`\nIndexNow → HTTP ${status}${body ? ` ${body}` : ""}`);
  if (status !== 200 && status !== 202) process.exit(1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(`indexnow failed: ${e.message}`);
    process.exit(2);
  });
}
