import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { changedUrls } from "./indexnow.mjs";

const m = (id, over = {}) => ({
  id, name: id, status: "active", deprecatedAt: null, successorId: null,
  pricing: { input: 1, output: 2 }, limits: { contextWindow: 1 }, supports: {},
  i18n: { en: { tagline: "t", description: "d" }, zh: { tagline: "t", description: "d" } },
  lastVerified: "2026-01-01", ...over,
});

describe("changedUrls", () => {
  it("returns nothing when no page-affecting field changed", () => {
    expect(changedUrls([m("a")], [m("a", { lastVerified: "2026-09-30" })])).toEqual([]);
  });
  it("includes new models, changed models and the derived pages — not untouched models", () => {
    const urls = changedUrls([m("a"), m("b")], [m("a"), m("b", { pricing: { input: 0.5, output: 2 } }), m("c")]);
    expect(urls).toContain("https://aicostcalc.net/b-cost-calculator");
    expect(urls).toContain("https://aicostcalc.net/c-cost-calculator");
    expect(urls).not.toContain("https://aicostcalc.net/a-cost-calculator");
    expect(urls).toContain("https://aicostcalc.net/changes");
  });
  it("treats a draft being reviewed (draft removed) as a change", () => {
    expect(changedUrls([m("a", { draft: { generatedAt: "x" } })], [m("a")]).length).toBeGreaterThan(0);
  });
});

describe("IndexNow key file", () => {
  it("exactly one public/<32 hex>.txt whose content is its own name", () => {
    const files = fs.readdirSync("public").filter((f) => /^[0-9a-f]{32}\.txt$/.test(f));
    expect(files).toHaveLength(1);
    expect(fs.readFileSync(`public/${files[0]}`, "utf8").trim()).toBe(files[0].slice(0, -4));
  });
});
