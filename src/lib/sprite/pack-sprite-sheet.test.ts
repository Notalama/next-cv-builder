import { describe, expect, it } from "vitest";
import {
  fitScaleToMaxCanvas,
  layoutSpriteSheet,
  validateSpriteSheetLayout,
} from "@/lib/sprite/pack-sprite-sheet";
import {
  MAX_SPRITE_CANVAS_DIMENSION,
  spriteSheetLayoutSchema,
} from "@/models/sprite";

describe("layoutSpriteSheet", () => {
  it("returns empty layout for no frames", () => {
    expect(layoutSpriteSheet([])).toEqual({
      width: 0,
      height: 0,
      positions: [],
    });
  });

  it("packs frames in a single horizontal row", () => {
    const layout = layoutSpriteSheet([
      { width: 10, height: 20 },
      { width: 30, height: 15 },
    ]);

    expect(layout.width).toBe(40);
    expect(layout.height).toBe(20);
    expect(layout.positions).toEqual([
      { x: 0, y: 0, width: 10, height: 20 },
      { x: 10, y: 0, width: 30, height: 15 },
    ]);
  });
});

describe("spriteSheetLayoutSchema", () => {
  it("accepts dimensions within the canvas limit", () => {
    const result = spriteSheetLayoutSchema.safeParse({
      width: MAX_SPRITE_CANVAS_DIMENSION,
      height: 256,
      frameCount: 4,
    });
    expect(result.success).toBe(true);
  });

  it("rejects width above the canvas limit", () => {
    const result = spriteSheetLayoutSchema.safeParse({
      width: MAX_SPRITE_CANVAS_DIMENSION + 1,
      height: 256,
      frameCount: 4,
    });
    expect(result.success).toBe(false);
  });
});

describe("validateSpriteSheetLayout", () => {
  it("fails when packed width exceeds the limit", () => {
    const frames = Array.from({ length: 10 }, () => ({
      width: Math.ceil(MAX_SPRITE_CANVAS_DIMENSION / 5),
      height: 64,
    }));
    const result = validateSpriteSheetLayout(frames);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain(String(MAX_SPRITE_CANVAS_DIMENSION));
    }
  });

  it("passes for a compact sheet", () => {
    const result = validateSpriteSheetLayout([
      { width: 64, height: 64 },
      { width: 64, height: 64 },
    ]);
    expect(result.ok).toBe(true);
  });
});

describe("fitScaleToMaxCanvas", () => {
  it("returns null when full size already fits", () => {
    expect(
      fitScaleToMaxCanvas([
        { width: 64, height: 64 },
        { width: 64, height: 64 },
      ]),
    ).toBeNull();
  });

  it("returns a scale that fits an oversized row", () => {
    const frames = Array.from({ length: 10 }, () => ({
      width: Math.ceil(MAX_SPRITE_CANVAS_DIMENSION / 5),
      height: 64,
    }));
    const fit = fitScaleToMaxCanvas(frames);
    expect(fit).not.toBeNull();
    if (fit != null) {
      expect(fit.scale).toBeLessThan(1);
      expect(fit.layout.width).toBeLessThanOrEqual(MAX_SPRITE_CANVAS_DIMENSION);
      expect(fit.layout.height).toBeLessThanOrEqual(
        MAX_SPRITE_CANVAS_DIMENSION,
      );
      expect(validateSpriteSheetLayout(frames, fit.scale).ok).toBe(true);
    }
  });
});
