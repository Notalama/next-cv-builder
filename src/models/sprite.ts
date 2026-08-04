import { z } from "zod";

export const MAX_SPRITE_CANVAS_DIMENSION = 32000;

export type SpriteFrame = {
  id: string;
  file: File;
  name: string;
  width: number;
  height: number;
  previewUrl: string;
};

export type SpriteSheetResult = {
  blob: Blob;
  objectUrl: string;
  width: number;
  height: number;
  frameCount: number;
};

export type SpriteFrameSize = {
  width: number;
  height: number;
};

export type SpriteLayout = {
  width: number;
  height: number;
  positions: Array<{ x: number; y: number; width: number; height: number }>;
};

export const spriteSheetLayoutSchema = z.object({
  width: z
    .number()
    .int()
    .positive()
    .max(
      MAX_SPRITE_CANVAS_DIMENSION,
      `Sprite sheet width must be at most ${MAX_SPRITE_CANVAS_DIMENSION}px`,
    ),
  height: z
    .number()
    .int()
    .positive()
    .max(
      MAX_SPRITE_CANVAS_DIMENSION,
      `Sprite sheet height must be at most ${MAX_SPRITE_CANVAS_DIMENSION}px`,
    ),
  frameCount: z.number().int().positive(),
});

export type SpriteSheetLayoutInput = z.infer<typeof spriteSheetLayoutSchema>;
