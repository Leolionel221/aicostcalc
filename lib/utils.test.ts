import { describe, expect, it } from "vitest";
import { formatContext } from "./utils";

describe("formatContext", () => {
  it("uses K below a million and M above", () => {
    expect(formatContext(200_000)).toBe("200K");
    expect(formatContext(922_000)).toBe("922K");
    expect(formatContext(1_000_000)).toBe("1M");
    expect(formatContext(1_048_576)).toBe("1.05M");
    expect(formatContext(2_000_000)).toBe("2M");
  });
});
