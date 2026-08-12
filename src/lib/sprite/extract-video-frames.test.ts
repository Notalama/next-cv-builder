import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { extractFramesFromVideo } from "@/lib/sprite/extract-video-frames";

type Listener = EventListenerOrEventListenerObject;

function invoke(listener: Listener, event: Event) {
  if (typeof listener === "function") {
    listener(event);
  } else {
    listener.handleEvent(event);
  }
}

describe("extractFramesFromVideo", () => {
  const originalCreateElement = document.createElement.bind(document);
  const createObjectURL = vi.fn(() => "blob:mock-video");
  const revokeObjectURL = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("URL", {
      ...URL,
      createObjectURL,
      revokeObjectURL,
    });
  });

  afterEach(() => {
    document.createElement = originalCreateElement;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("rejects non-positive fps", async () => {
    const file = new File(["x"], "clip.mp4", { type: "video/mp4" });
    await expect(extractFramesFromVideo(file, { fps: 0 })).rejects.toThrow(
      "FPS must be greater than 0.",
    );
  });

  it("extracts png blobs at the requested fps with progress", async () => {
    const listeners = new Map<string, Set<Listener>>();
    let currentTime = 0;

    const video = {
      duration: 0.2,
      videoWidth: 4,
      videoHeight: 4,
      muted: false,
      playsInline: false,
      preload: "",
      src: "",
      get currentTime() {
        return currentTime;
      },
      set currentTime(value: number) {
        currentTime = value;
        queueMicrotask(() => {
          for (const listener of listeners.get("seeked") ?? []) {
            invoke(listener, new Event("seeked"));
          }
        });
      },
      addEventListener(type: string, listener: Listener) {
        const set = listeners.get(type) ?? new Set<Listener>();
        set.add(listener);
        listeners.set(type, set);
      },
      removeEventListener(type: string, listener: Listener) {
        listeners.get(type)?.delete(listener);
      },
      removeAttribute() {},
      load() {
        queueMicrotask(() => {
          for (const listener of listeners.get("loadedmetadata") ?? []) {
            invoke(listener, new Event("loadedmetadata"));
          }
        });
      },
    };

    const context = {
      clearRect: vi.fn(),
      drawImage: vi.fn(),
    };

    const canvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => context),
      toBlob: (callback: BlobCallback) => {
        callback(new Blob(["frame"], { type: "image/png" }));
      },
    };

    document.createElement = ((tagName: string) => {
      if (tagName === "video") {
        return video as unknown as HTMLVideoElement;
      }
      if (tagName === "canvas") {
        return canvas as unknown as HTMLCanvasElement;
      }
      return originalCreateElement(tagName);
    }) as typeof document.createElement;

    const progress: Array<{ current: number; total: number }> = [];
    const file = new File(["video"], "clip.mp4", { type: "video/mp4" });
    const frames = await extractFramesFromVideo(file, {
      fps: 10,
      onProgress: (value) => progress.push(value),
    });

    expect(frames).toHaveLength(2);
    expect(frames.every((frame) => frame.type === "image/png")).toBe(true);
    expect(progress).toEqual([
      { current: 1, total: 2 },
      { current: 2, total: 2 },
    ]);
    expect(context.drawImage).toHaveBeenCalledTimes(2);
    expect(createObjectURL).toHaveBeenCalledWith(file);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:mock-video");
  });

  it("throws when video metadata is invalid", async () => {
    const listeners = new Map<string, Set<Listener>>();
    const video = {
      duration: Number.NaN,
      videoWidth: 0,
      videoHeight: 0,
      muted: false,
      playsInline: false,
      preload: "",
      src: "",
      currentTime: 0,
      addEventListener(type: string, listener: Listener) {
        const set = listeners.get(type) ?? new Set<Listener>();
        set.add(listener);
        listeners.set(type, set);
      },
      removeEventListener(type: string, listener: Listener) {
        listeners.get(type)?.delete(listener);
      },
      removeAttribute() {},
      load() {
        queueMicrotask(() => {
          for (const listener of listeners.get("loadedmetadata") ?? []) {
            invoke(listener, new Event("loadedmetadata"));
          }
        });
      },
    };

    document.createElement = ((tagName: string) => {
      if (tagName === "video") {
        return video as unknown as HTMLVideoElement;
      }
      return originalCreateElement(tagName);
    }) as typeof document.createElement;

    const file = new File(["video"], "clip.mp4", { type: "video/mp4" });
    await expect(extractFramesFromVideo(file)).rejects.toThrow(
      "Video has invalid dimensions or duration.",
    );
  });
});
