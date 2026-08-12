export const VIDEO_EXTRACT_FPS = 15;

export type ExtractVideoFramesProgress = {
  current: number;
  total: number;
};

function waitForSeek(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const onSeeked = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("Failed to seek video frame."));
    };
    const cleanup = () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
    };

    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onError);

    // Some browsers skip seeked if currentTime is already at the target.
    if (Math.abs(video.currentTime - time) < 0.0005) {
      cleanup();
      resolve();
      return;
    }

    video.currentTime = time;
  });
}

function loadVideoMetadata(
  video: HTMLVideoElement,
  url: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const onLoaded = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("Failed to load video metadata."));
    };
    const cleanup = () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("error", onError);
    };

    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("error", onError);
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.src = url;
    video.load();
  });
}

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob == null) {
        reject(new Error("Failed to export video frame as PNG."));
        return;
      }
      resolve(blob);
    }, "image/png");
  });
}

/**
 * Extracts PNG frame blobs from an MP4 at a fixed FPS by seeking through the video.
 * Does not scale or crop frames.
 */
export async function extractFramesFromVideo(
  videoFile: File,
  options?: {
    fps?: number;
    onProgress?: (progress: ExtractVideoFramesProgress) => void;
  },
): Promise<Blob[]> {
  const fps = options?.fps ?? VIDEO_EXTRACT_FPS;
  if (!(fps > 0)) {
    throw new Error("FPS must be greater than 0.");
  }

  const url = URL.createObjectURL(videoFile);
  const video = document.createElement("video");

  try {
    await loadVideoMetadata(video, url);

    if (
      !Number.isFinite(video.duration) ||
      video.duration <= 0 ||
      video.videoWidth <= 0 ||
      video.videoHeight <= 0
    ) {
      throw new Error("Video has invalid dimensions or duration.");
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d", { alpha: true });
    if (context == null) {
      throw new Error("Canvas 2D context is unavailable.");
    }

    const interval = 1 / fps;
    const total = Math.max(1, Math.ceil(video.duration * fps));
    const frames: Blob[] = [];

    for (let index = 0; index < total; index += 1) {
      const time = Math.min(
        index * interval,
        Math.max(0, video.duration - 0.001),
      );
      await waitForSeek(video, time);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      frames.push(await canvasToPngBlob(canvas));
      options?.onProgress?.({ current: index + 1, total });
    }

    return frames;
  } finally {
    video.removeAttribute("src");
    video.load();
    URL.revokeObjectURL(url);
  }
}
