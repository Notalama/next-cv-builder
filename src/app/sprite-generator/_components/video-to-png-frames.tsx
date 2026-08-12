"use client";

import { Film } from "lucide-react";
import { useId, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { blobToUint8Array, createZipBlob } from "@/lib/sprite/create-zip-blob";
import { downloadBlob } from "@/lib/sprite/download-blob";
import { extractFramesFromVideo } from "@/lib/sprite/extract-video-frames";

function isMp4File(file: File) {
  return file.type === "video/mp4" || file.name.toLowerCase().endsWith(".mp4");
}

function padFrameIndex(index: number, total: number) {
  const digits = Math.max(4, String(total).length);
  return String(index).padStart(digits, "0");
}

export function VideoToPngFrames() {
  const videoInputId = useId();
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFrames, setVideoFrames] = useState<Blob[]>([]);
  const [isConvertingVideo, setIsConvertingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState<string | null>(null);

  const convertVideo = () => {
    if (videoFile == null || isConvertingVideo) {
      return;
    }

    setIsConvertingVideo(true);
    setVideoProgress("Extracting frames…");
    setVideoFrames([]);

    void (async () => {
      try {
        const frameBlobs = await extractFramesFromVideo(videoFile, {
          onProgress: ({ current, total }) => {
            setVideoProgress(`Extracting frames ${current}/${total}`);
          },
        });

        setVideoFrames(frameBlobs);
        setVideoProgress(null);
        toast.success(
          `Extracted ${frameBlobs.length} PNG frame${frameBlobs.length === 1 ? "" : "s"}`,
        );
      } catch (error) {
        console.error(error);
        setVideoProgress(null);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to convert video into PNGs",
        );
      } finally {
        setIsConvertingVideo(false);
      }
    })();
  };

  const downloadVideoFrames = () => {
    if (videoFrames.length === 0) {
      return;
    }

    void (async () => {
      try {
        const entries = await Promise.all(
          videoFrames.map(async (frame, index) => ({
            name: `frame-${padFrameIndex(index + 1, videoFrames.length)}.png`,
            data: await blobToUint8Array(frame),
          })),
        );
        const zip = createZipBlob(entries);
        downloadBlob(zip, "video-frames.zip");
      } catch (error) {
        console.error(error);
        toast.error("Failed to download video frames.");
      }
    })();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Video to PNG frames</CardTitle>
        <CardDescription>
          Extract frames at 30 FPS at native resolution and download them as
          separate PNGs in a ZIP. Frames are never scaled or cropped.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label
            htmlFor={videoInputId}
            className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-sm transition-colors hover:bg-muted/40"
          >
            <Film className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate">
              {videoFile?.name ?? "Choose an MP4 video"}
            </span>
            <input
              ref={videoInputRef}
              id={videoInputId}
              type="file"
              accept="video/mp4"
              className="sr-only"
              aria-label="MP4 video"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                if (file == null) {
                  setVideoFile(null);
                  return;
                }
                if (!isMp4File(file)) {
                  toast.error("Only MP4 video files are supported.");
                  event.target.value = "";
                  return;
                }
                setVideoFile(file);
                setVideoFrames([]);
              }}
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              disabled={videoFile == null || isConvertingVideo}
              onClick={convertVideo}
            >
              <LoadingSwap isLoading={isConvertingVideo}>
                Convert video to PNGs
              </LoadingSwap>
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={videoFrames.length === 0 || isConvertingVideo}
              aria-label="Download video frames"
              onClick={downloadVideoFrames}
            >
              Download frames (.zip)
            </Button>
          </div>
        </div>

        {videoProgress != null ? (
          <p className="text-muted-foreground text-sm" aria-live="polite">
            {videoProgress}
          </p>
        ) : null}

        {videoFrames.length > 0 ? (
          <p className="text-sm font-medium">
            {videoFrames.length} PNG frame
            {videoFrames.length === 1 ? "" : "s"} ready to download
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
