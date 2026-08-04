import {
  MAX_SPRITE_CANVAS_DIMENSION,
  type SpriteFrameSize,
  type SpriteLayout,
  spriteSheetLayoutSchema,
} from "@/models/sprite";

export function layoutSpriteSheet(frames: SpriteFrameSize[]): SpriteLayout {
  if (frames.length === 0) {
    return { width: 0, height: 0, positions: [] };
  }

  const height = frames.reduce((max, frame) => Math.max(max, frame.height), 0);
  let x = 0;
  const positions = frames.map((frame) => {
    const position = {
      x,
      y: 0,
      width: frame.width,
      height: frame.height,
    };
    x += frame.width;
    return position;
  });

  return {
    width: x,
    height,
    positions,
  };
}

export function scaleFrameSizes(
  frames: SpriteFrameSize[],
  scale: number,
): SpriteFrameSize[] {
  return frames.map((frame) => ({
    width: Math.max(1, Math.floor(frame.width * scale)),
    height: Math.max(1, Math.floor(frame.height * scale)),
  }));
}

export function validateSpriteSheetLayout(
  frames: SpriteFrameSize[],
  scale = 1,
):
  | { ok: true; layout: SpriteLayout }
  | { ok: false; layout: SpriteLayout; message: string } {
  const sizedFrames = scale === 1 ? frames : scaleFrameSizes(frames, scale);
  const layout = layoutSpriteSheet(sizedFrames);

  if (frames.length === 0) {
    return { ok: true, layout };
  }

  const parsed = spriteSheetLayoutSchema.safeParse({
    width: layout.width,
    height: layout.height,
    frameCount: frames.length,
  });

  if (!parsed.success) {
    const detail = parsed.error.issues.map((issue) => issue.message).join(" ");
    return {
      ok: false,
      layout,
      message: `Canvas would be ${layout.width}×${layout.height}px. ${detail}. Remove frames or use smaller images.`,
    };
  }

  return { ok: true, layout };
}

/**
 * Scale needed so a single-row sheet fits within MAX_SPRITE_CANVAS_DIMENSION.
 * Returns null when full size already fits, or when fitting is impossible.
 */
export function fitScaleToMaxCanvas(
  frames: SpriteFrameSize[],
): { scale: number; layout: SpriteLayout } | null {
  if (frames.length === 0) {
    return null;
  }

  const fullValidation = validateSpriteSheetLayout(frames, 1);
  if (fullValidation.ok) {
    return null;
  }

  // At 1px per frame, width is at least frame count.
  if (frames.length > MAX_SPRITE_CANVAS_DIMENSION) {
    return null;
  }

  const fullLayout = fullValidation.layout;
  let scale = Math.min(
    MAX_SPRITE_CANVAS_DIMENSION / fullLayout.width,
    MAX_SPRITE_CANVAS_DIMENSION / fullLayout.height,
  );

  for (let attempt = 0; attempt < 24; attempt += 1) {
    const validation = validateSpriteSheetLayout(frames, scale);
    if (validation.ok) {
      return { scale, layout: validation.layout };
    }
    scale *= 0.99;
  }

  return null;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image: ${file.name}`));
    };
    image.src = url;
  });
}

export async function packSpriteSheet(
  files: File[],
  options?: { scale?: number },
): Promise<{ blob: Blob; width: number; height: number; frameCount: number }> {
  if (files.length === 0) {
    throw new Error("No frames to pack.");
  }

  const scale = options?.scale ?? 1;
  if (!(scale > 0)) {
    throw new Error("Scale must be greater than 0.");
  }

  const images = await Promise.all(files.map((file) => loadImage(file)));
  const sizes = images.map((image) => ({
    width: image.naturalWidth,
    height: image.naturalHeight,
  }));
  const validation = validateSpriteSheetLayout(sizes, scale);
  if (!validation.ok) {
    throw new Error(validation.message);
  }
  const { layout } = validation;

  const canvas = document.createElement("canvas");
  canvas.width = layout.width;
  canvas.height = layout.height;
  const context = canvas.getContext("2d", { alpha: true });
  if (context == null) {
    throw new Error("Canvas 2D context is unavailable.");
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.clearRect(0, 0, canvas.width, canvas.height);

  images.forEach((image, index) => {
    const position = layout.positions[index];
    if (position == null) {
      return;
    }
    context.drawImage(
      image,
      position.x,
      position.y,
      position.width,
      position.height,
    );
  });

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result == null) {
        reject(new Error("Failed to export sprite sheet PNG."));
        return;
      }
      resolve(result);
    }, "image/png");
  });

  return {
    blob,
    width: layout.width,
    height: layout.height,
    frameCount: files.length,
  };
}

export function readImageDimensions(
  file: File,
): Promise<{ width: number; height: number; previewUrl: string }> {
  return new Promise((resolve, reject) => {
    const previewUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
        previewUrl,
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(previewUrl);
      reject(new Error(`Failed to read image: ${file.name}`));
    };
    image.src = previewUrl;
  });
}
