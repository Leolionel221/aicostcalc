import { describe, expect, it } from "vitest";
import modelsData from "@/data/models.json";
import type { Model, ModelsData } from "./types";
import { buildChangeLog, changeTitle } from "./changes";

const base = (over: Partial<Model>): Model =>
  ({
    id: "m",
    name: "Model",
    provider: "P",
    providerId: "p",
    priceHistory: [],
    ...over,
  }) as Model;

describe("buildChangeLog", () => {
  it("reports 'Initial release' as released and 'First listed' as added", () => {
    const ev = buildChangeLog([
      base({ id: "a", name: "A", priceHistory: [{ date: "2026-01-01", input: 1, output: 2, note: "Initial release" }] }),
      base({ id: "b", name: "B", priceHistory: [{ date: "2026-02-01", input: 1, output: 2, note: "First listed; auto-drafted from LiteLLM registry" }] }),
    ]);
    expect(ev.find((e) => e.modelId === "a")!.kind).toBe("released");
    expect(ev.find((e) => e.modelId === "b")!.kind).toBe("added");
  });

  it("never reports our own data corrections as price moves, and measures later moves from the corrected value", () => {
    const ev = buildChangeLog([
      base({
        priceHistory: [
          { date: "2026-06-01", input: 0.14, output: 0.28, note: "Initial release" },
          { date: "2026-08-24", input: 0.44, output: 1.32, note: "Corrected to match LiteLLM registry (site previously listed $0.14/$0.28)" },
          { date: "2026-09-13", input: 0.3, output: 1.2, note: "Automated sync with LiteLLM registry (was $0.44/$1.32)" },
        ],
      }),
    ]);
    const moves = ev.filter((e) => e.kind !== "released");
    expect(moves).toHaveLength(1);
    expect(moves[0].date).toBe("2026-09-13");
    expect(moves[0].kind).toBe("price-cut");
    expect(moves[0].before).toEqual({ input: 0.44, output: 1.32 });
  });

  it("classifies mixed moves as a change, not a cut or rise", () => {
    const ev = buildChangeLog([
      base({
        priceHistory: [
          { date: "2026-01-01", input: 1, output: 4, note: "Initial release" },
          { date: "2026-02-01", input: 2, output: 2, note: "Automated sync" },
        ],
      }),
    ]);
    expect(ev[0].kind).toBe("price-change");
  });

  it("sorts newest first", () => {
    const ev = buildChangeLog((modelsData as ModelsData).models);
    for (let i = 1; i < ev.length; i++) expect(ev[i - 1].date >= ev[i].date).toBe(true);
  });

  it("on the real dataset, emits no price event dated on the 2026-08-24 correction day", () => {
    const ev = buildChangeLog((modelsData as ModelsData).models);
    expect(ev.some((e) => e.date === "2026-08-24" && e.kind.startsWith("price"))).toBe(false);
    expect(ev.filter((e) => e.kind === "price-cut").length).toBeGreaterThan(0);
  });
});

describe("changeTitle", () => {
  it("states the per-call saving for a cut", () => {
    const [e] = buildChangeLog([
      base({
        name: "GPT-5.6 Terra",
        priceHistory: [
          { date: "2026-06-15", input: 2.5, output: 15, note: "Initial release" },
          { date: "2026-08-01", input: 2, output: 12, note: "Price reduction" },
        ],
      }),
    ]);
    expect(changeTitle(e)).toBe("GPT-5.6 Terra price cut: $2.50/$15.00 → $2.00/$12.00 (20% cheaper per call)");
  });
});
