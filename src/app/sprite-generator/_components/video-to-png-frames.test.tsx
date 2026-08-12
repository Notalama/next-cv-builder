import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/test/rtl-cleanup";

const extractFramesFromVideo = vi.hoisted(() => vi.fn<() => Promise<Blob[]>>());
const downloadBlob = vi.hoisted(() => vi.fn());

vi.mock("@/lib/sprite/extract-video-frames", () => ({
  VIDEO_EXTRACT_FPS: 15,
  extractFramesFromVideo,
}));

vi.mock("@/lib/sprite/download-blob", () => ({
  downloadBlob,
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { VideoToPngFrames } from "./video-to-png-frames";

function selectMp4(file: File) {
  fireEvent.change(screen.getByLabelText("MP4 video"), {
    target: { files: [file] },
  });
}

describe("VideoToPngFrames", () => {
  beforeEach(() => {
    extractFramesFromVideo.mockReset();
    downloadBlob.mockReset();
  });

  it("keeps convert and download disabled until a video is selected and converted", () => {
    render(<VideoToPngFrames />);

    expect(
      screen.getByRole("button", { name: "Convert video to PNGs" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Download video frames" }),
    ).toBeDisabled();
  });

  it("converts a selected mp4 and enables zip download", async () => {
    const user = userEvent.setup();
    extractFramesFromVideo.mockResolvedValue([
      new Blob(["a"], { type: "image/png" }),
      new Blob(["b"], { type: "image/png" }),
    ]);

    render(<VideoToPngFrames />);
    selectMp4(new File(["video"], "sample-clip.mp4", { type: "video/mp4" }));

    const convertButton = screen.getByRole("button", {
      name: "Convert video to PNGs",
    });
    expect(convertButton).toBeEnabled();

    await user.click(convertButton);

    await waitFor(() => {
      expect(screen.getByText("2 PNG frames ready to download")).toBeVisible();
    });
    expect(extractFramesFromVideo).toHaveBeenCalledTimes(1);

    const downloadButton = screen.getByRole("button", {
      name: "Download video frames",
    });
    expect(downloadButton).toBeEnabled();

    await user.click(downloadButton);

    await waitFor(() => {
      expect(downloadBlob).toHaveBeenCalledWith(
        expect.any(Blob),
        "video-frames.zip",
      );
    });
  });

  it("keeps download disabled when conversion fails", async () => {
    const user = userEvent.setup();
    extractFramesFromVideo.mockRejectedValue(
      new Error("Video has invalid dimensions or duration."),
    );

    render(<VideoToPngFrames />);
    selectMp4(new File(["video"], "sample-clip.mp4", { type: "video/mp4" }));
    await user.click(
      screen.getByRole("button", { name: "Convert video to PNGs" }),
    );

    await waitFor(() => {
      expect(extractFramesFromVideo).toHaveBeenCalledTimes(1);
    });
    expect(
      screen.queryByText(/PNG frames? ready to download/),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Download video frames" }),
    ).toBeDisabled();
  });
});
