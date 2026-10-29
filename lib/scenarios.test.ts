import { describe, expect, it } from "vitest";
import modelsData from "@/data/models.json";
import scenarios from "@/data/scenarios.json";
import type { ModelsData } from "./types";

const models = (modelsData as ModelsData).models;

// The templates pointed at gemini-3-0-flash and deepseek-v4 for five months after
// those ids were renamed, and at Claude Haiku 4.5 after it retired (found 2026-10-29).
describe("scenario templates", () => {
  it.each(scenarios.scenarios.map((s) => [s.id, s.recommendedModelIds] as const))(
    "%s recommends only models that exist and are not retired",
    (_id, ids) => {
      for (const id of ids) {
        const m = models.find((x) => x.id === id);
        expect(m, id).toBeDefined();
        expect(m!.status, id).not.toBe("deprecated");
      }
    },
  );
});
