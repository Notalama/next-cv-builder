import { describe, expect, it } from "vitest";
import { CV_TITLE_MAX_LENGTH, titleWithCopySuffix } from "@/models/cv-document";

describe("titleWithCopySuffix", () => {
  it("appends (copy) to the base title", () => {
    expect(titleWithCopySuffix("Ada Lovelace")).toBe("Ada Lovelace (copy)");
  });

  it("falls back to Untitled CV for blank input", () => {
    expect(titleWithCopySuffix("   ")).toBe("Untitled CV (copy)");
  });

  it("keeps the result within the max title length", () => {
    const longTitle = "A".repeat(CV_TITLE_MAX_LENGTH);
    const result = titleWithCopySuffix(longTitle);
    expect(result.length).toBeLessThanOrEqual(CV_TITLE_MAX_LENGTH);
    expect(result.endsWith(" (copy)")).toBe(true);
  });
});
