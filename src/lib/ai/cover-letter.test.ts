import { describe, expect, it } from "vitest";
import {
  COVER_LETTER_MAX_WORDS,
  COVER_LETTER_MIN_WORDS,
  countWords,
  generateCoverLetterInputSchema,
} from "@/models/cover-letter";

describe("countWords", () => {
  it("counts whitespace-separated tokens", () => {
    expect(countWords("  one two   three ")).toBe(3);
  });

  it("returns 0 for empty or whitespace-only text", () => {
    expect(countWords("")).toBe(0);
    expect(countWords("   ")).toBe(0);
  });
});

describe("generateCoverLetterInputSchema", () => {
  it("rejects empty required fields", () => {
    const result = generateCoverLetterInputSchema.safeParse({
      cvId: "",
      companyName: "",
      jobRole: "",
    });

    expect(result.success).toBe(false);
  });

  it("defaults language to en", () => {
    const result = generateCoverLetterInputSchema.parse({
      cvId: "cv-1",
      companyName: "Acme",
      jobRole: "Engineer",
    });

    expect(result.language).toBe("en");
  });
});

describe("generateCoverLetter mock path", () => {
  it("returns a letter within the 50-100 word range", async () => {
    const previousMock = process.env.AI_IMPROVE_MOCK;
    process.env.AI_IMPROVE_MOCK = "true";

    try {
      const { generateCoverLetter } = await import("@/lib/ai/cover-letter");
      const { CV_FORM_DEFAULT_VALUES } = await import("@/models/cv");

      const result = await generateCoverLetter({
        input: {
          companyName: "Acme Corp",
          jobRole: "Staff Engineer",
          language: "en",
        },
        cv: {
          ...CV_FORM_DEFAULT_VALUES,
          fullName: "Ada Lovelace",
          role: "Software Engineer",
          aboutMe:
            "Engineer with a track record of turning research into shipped products.",
          primarySkills: "TypeScript, React, systems design",
          projects: [
            {
              companyName: "Analytical Engines",
              period: "2020 - Present",
              position: "Lead Engineer",
              description:
                "Led delivery of a compiler toolchain used by 40+ internal teams.",
              technologies: "TypeScript, Rust",
              domain: "Developer Tools",
            },
          ],
        },
      });

      expect(result.mocked).toBe(true);
      expect(result.wordCount).toBeGreaterThanOrEqual(COVER_LETTER_MIN_WORDS);
      expect(result.wordCount).toBeLessThanOrEqual(COVER_LETTER_MAX_WORDS);
      expect(countWords(result.coverLetter)).toBe(result.wordCount);
      expect(result.coverLetter).toContain("Acme Corp");
      expect(result.coverLetter).toContain("Staff Engineer");
    } finally {
      if (previousMock == null) {
        delete process.env.AI_IMPROVE_MOCK;
      } else {
        process.env.AI_IMPROVE_MOCK = previousMock;
      }
    }
  });
});
