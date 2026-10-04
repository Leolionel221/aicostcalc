import { describe, expect, it } from "vitest";
import { parseShareState, serializeShareState, SHARE_DEFAULTS, type ShareState } from "./share-state";

const IDS = ["gpt-6-sol", "claude-opus-5-5"];
const base: ShareState = { modelId: "gpt-6-sol", ...SHARE_DEFAULTS };

describe("share state", () => {
  it("keeps the URL clean when nothing changed", () => {
    expect(serializeShareState(base, "gpt-6-sol")).toBe("");
  });

  it("round-trips a full configuration", () => {
    const s: ShareState = {
      modelId: "claude-opus-5-5",
      inputTokens: "20000",
      outputTokens: "800",
      cachingEnabled: true,
      cachedPortion: 0.75,
      batchEnabled: true,
      currency: "EUR",
    };
    const qs = serializeShareState(s, "gpt-6-sol");
    expect(qs).toBe("?model=claude-opus-5-5&in=20000&out=800&cache=75&batch=1&cur=EUR");
    expect(parseShareState(qs, IDS)).toEqual(s);
  });

  it("ignores unknown models and junk values instead of throwing", () => {
    expect(
      parseShareState("?model=gpt-99&in=-5&out=1e9&cache=150&batch=yes&cur=JPY", IDS),
    ).toEqual({});
  });

  it("rejects absurd token counts", () => {
    expect(parseShareState("?in=999999999", IDS)).toEqual({});
    expect(parseShareState("?in=100000000", IDS)).toEqual({ inputTokens: "100000000" });
  });

  it("snaps the cached portion to the slider's 5% steps", () => {
    expect(parseShareState("?cache=33", IDS).cachedPortion).toBeCloseTo(0.35);
  });

  it("does not write an empty or invalid token field", () => {
    expect(serializeShareState({ ...base, inputTokens: "" }, "gpt-6-sol")).toBe("");
  });
});
