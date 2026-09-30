import { describe, expect, it } from "vitest";
import modelsData from "@/data/models.json";
import type { ModelsData } from "./types";
import { filterModels, readFilters, resolveModel } from "./api";

const models = (modelsData as ModelsData).models;
const f = (q: string) => filterModels(models, readFilters(new URLSearchParams(q)));

describe("resolveModel", () => {
  it.each([
    ["gpt-6-luna", "gpt-6-luna"],
    ["gpt-6.luna", "gpt-6-luna"],
    ["GPT-5.6", "gpt-5-6"],
    ["claude-opus-4.7", "claude-opus-4-7"],
    ["gpt-6-luna-cost-calculator", "gpt-6-luna"],
    ["gpt%2D6%2Dluna", "gpt-6-luna"],
  ])("%s → %s", (raw, id) => expect(resolveModel(models, raw)?.id).toBe(id));

  it("returns undefined for unknown ids, including a malformed escape", () => {
    expect(resolveModel(models, "gpt-99")).toBeUndefined();
    expect(resolveModel(models, "%E0%A4%A")).toBeUndefined();
  });
});

describe("filterModels", () => {
  it("no filters returns everything", () => expect(f("")).toHaveLength(models.length));
  it("status=active excludes retired models", () => {
    expect(f("status=active").some((m) => m.status === "deprecated")).toBe(false);
    expect(f("status=active").length).toBeLessThan(models.length);
  });
  it("filters compose with AND and are case-insensitive", () => {
    const r = f("provider=OpenAI&capability=Batch");
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((m) => m.providerId === "openai" && m.supports.batch)).toBe(true);
  });
  it("capability matches supports keys regardless of case (structuredOutput)", () => {
    expect(f("capability=structuredoutput").every((m) => m.supports.structuredOutput)).toBe(true);
  });
  it("unknown values match nothing", () => expect(f("provider=nobody")).toHaveLength(0));
});
