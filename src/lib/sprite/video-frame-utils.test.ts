import { describe, expect, it } from "vitest";
import {
  isMp4File,
  padFrameIndex,
  videoFrameFileName,
} from "@/lib/sprite/video-frame-utils";

describe("isMp4File", () => {
  it("accepts video/mp4 mime type", () => {
    expect(isMp4File({ type: "video/mp4", name: "clip.bin" })).toBe(true);
  });

  it("accepts .mp4 extension case-insensitively", () => {
    expect(isMp4File({ type: "", name: "Clip.MP4" })).toBe(true);
  });

  it("rejects other types", () => {
    expect(isMp4File({ type: "image/png", name: "frame.png" })).toBe(false);
  });
});

describe("padFrameIndex", () => {
  it("pads to at least 4 digits", () => {
    expect(padFrameIndex(1, 9)).toBe("0001");
    expect(padFrameIndex(12, 99)).toBe("0012");
  });

  it("widens padding when total has more than 4 digits", () => {
    expect(padFrameIndex(7, 10000)).toBe("00007");
  });
});

describe("videoFrameFileName", () => {
  it("builds numbered png names", () => {
    expect(videoFrameFileName(1, 3)).toBe("frame-0001.png");
    expect(videoFrameFileName(3, 3)).toBe("frame-0003.png");
  });
});
