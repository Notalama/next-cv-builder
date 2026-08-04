"use client";

import { ArrowLeft, Grid2x2, Scaling, Trash2, Upload } from "lucide-react";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  fitScaleToMaxCanvas,
  packSpriteSheet,
  readImageDimensions,
  validateSpriteSheetLayout,
} from "@/lib/sprite/pack-sprite-sheet";
import { cn } from "@/lib/utils";
import {
  MAX_SPRITE_CANVAS_DIMENSION,
  type SpriteFrame,
  type SpriteSheetResult,
} from "@/models/sprite";

function isPngFile(file: File) {
  return file.type === "image/png" || file.name.toLowerCase().endsWith(".png");
}

export function SpriteGenerator() {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [frames, setFrames] = useState<SpriteFrame[]>([]);
  const [result, setResult] = useState<SpriteSheetResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [pendingMode, setPendingMode] = useState<"full" | "fit" | null>(null);

  const framesRef = useRef<SpriteFrame[]>([]);
  const resultRef = useRef<SpriteSheetResult | null>(null);
  framesRef.current = frames;
  resultRef.current = result;

  const fullLayoutValidation = validateSpriteSheetLayout(frames, 1);
  const fitScale = fitScaleToMaxCanvas(frames);
  const layoutError =
    fullLayoutValidation.ok || frames.length === 0
      ? null
      : fullLayoutValidation.message;

  const canCreateFull =
    frames.length > 0 && fullLayoutValidation.ok && !isPending;
  const canCreateFit = fitScale != null && !isPending;

  useEffect(() => {
    return () => {
      for (const frame of framesRef.current) {
        URL.revokeObjectURL(frame.previewUrl);
      }
      if (resultRef.current != null) {
        URL.revokeObjectURL(resultRef.current.objectUrl);
      }
    };
  }, []);

  const addFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    const pngFiles = files.filter(isPngFile);
    if (pngFiles.length === 0) {
      toast.error("Only PNG files are supported.");
      return;
    }
    if (pngFiles.length < files.length) {
      toast.error("Some files were skipped. Only PNG is supported.");
    }

    try {
      const nextFrames = await Promise.all(
        pngFiles.map(async (file) => {
          const dimensions = await readImageDimensions(file);
          return {
            id: crypto.randomUUID(),
            file,
            name: file.name,
            width: dimensions.width,
            height: dimensions.height,
            previewUrl: dimensions.previewUrl,
          } satisfies SpriteFrame;
        }),
      );
      setFrames((current) => [...current, ...nextFrames]);
      setResult((current) => {
        if (current != null) {
          URL.revokeObjectURL(current.objectUrl);
        }
        return null;
      });
    } catch {
      toast.error("Failed to read one or more PNG files.");
    }
  };

  const removeFrame = (id: string) => {
    setFrames((current) => {
      const target = current.find((frame) => frame.id === id);
      if (target != null) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return current.filter((frame) => frame.id !== id);
    });
    setResult((current) => {
      if (current != null) {
        URL.revokeObjectURL(current.objectUrl);
      }
      return null;
    });
  };

  const clearAll = () => {
    for (const frame of frames) {
      URL.revokeObjectURL(frame.previewUrl);
    }
    setFrames([]);
    setResult((current) => {
      if (current != null) {
        URL.revokeObjectURL(current.objectUrl);
      }
      return null;
    });
    if (inputRef.current != null) {
      inputRef.current.value = "";
    }
  };

  const createSprite = (mode: "full" | "fit") => {
    const scale = mode === "full" ? 1 : fitScale?.scale;
    const allowed = mode === "full" ? canCreateFull : canCreateFit;
    if (!allowed || scale == null) {
      return;
    }

    setPendingMode(mode);
    startTransition(async () => {
      try {
        const packed = await packSpriteSheet(
          frames.map((frame) => frame.file),
          { scale },
        );
        const objectUrl = URL.createObjectURL(packed.blob);
        setResult((current) => {
          if (current != null) {
            URL.revokeObjectURL(current.objectUrl);
          }
          return {
            blob: packed.blob,
            objectUrl,
            width: packed.width,
            height: packed.height,
            frameCount: packed.frameCount,
          };
        });
      } catch (error) {
        console.error(error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to create sprite sheet",
        );
      } finally {
        setPendingMode(null);
      }
    });
  };

  const downloadSprite = () => {
    if (result == null) {
      return;
    }
    const anchor = document.createElement("a");
    anchor.href = result.objectUrl;
    anchor.download = "sprite-sheet.png";
    anchor.click();
  };

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-10">
      <header className="space-y-4">
        <ButtonLink
          href="/dashboard"
          variant="ghost"
          className="w-fit gap-2 text-muted-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </ButtonLink>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Sprite Sheet Generator
          </h1>
          <p className="text-sm text-muted-foreground">
            Upload PNG frames, pack them into one transparent sheet, and
            download for Unity 2D.
          </p>
        </div>
      </header>

      {result != null ? (
        <section aria-label="Generated sprite sheet">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Generated sprite sheet
              </CardTitle>
              <CardDescription>
                {result.frameCount} frames · {result.width}×{result.height} px
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-auto rounded-lg border p-4 bg-[linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%),linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%)] bg-[length:16px_16px] bg-[position:0_0,8px_8px] dark:bg-[linear-gradient(45deg,#444_25%,transparent_25%,transparent_75%,#444_75%),linear-gradient(45deg,#444_25%,transparent_25%,transparent_75%,#444_75%)]">
                <img
                  src={result.objectUrl}
                  alt="Generated sprite sheet preview"
                  className="mx-auto max-h-64 max-w-full object-contain"
                />
              </div>
              <div className="flex justify-end">
                <Button type="button" onClick={downloadSprite}>
                  Download Sprite Sheet (.png)
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload frames</CardTitle>
          <CardDescription>
            Drop multiple PNG files or browse. Frames pack left to right in
            selection order.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap justify-end gap-2">
            {fitScale != null ? (
              <Button
                type="button"
                variant="outline"
                disabled={!canCreateFit}
                className="gap-2"
                aria-label="Create fitted sprite"
                onClick={() => createSprite("fit")}
              >
                <LoadingSwap isLoading={isPending && pendingMode === "fit"}>
                  <span className="inline-flex items-center gap-2">
                    <Scaling className="size-4" />
                    Create Fitted Sprite ({Math.round(fitScale.scale * 100)}%)
                  </span>
                </LoadingSwap>
              </Button>
            ) : null}
            <Button
              type="button"
              disabled={!canCreateFull}
              className="gap-2"
              onClick={() => createSprite("full")}
            >
              <LoadingSwap isLoading={isPending && pendingMode === "full"}>
                <span className="inline-flex items-center gap-2">
                  <Grid2x2 className="size-4" />
                  Create Sprite
                </span>
              </LoadingSwap>
            </Button>
          </div>

          {layoutError != null ? (
            <p
              role="alert"
              className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-destructive text-sm"
            >
              {layoutError}
              {fitScale != null
                ? ` Use Create Fitted Sprite to scale frames to fit ${MAX_SPRITE_CANVAS_DIMENSION}px (${Math.round(fitScale.scale * 100)}% → ${fitScale.layout.width}×${fitScale.layout.height}px).`
                : " Fitting to the max canvas size is not possible with this many frames."}
            </p>
          ) : null}

          <label
            htmlFor={inputId}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-10 text-center transition-colors",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/30 hover:border-muted-foreground/60 hover:bg-muted/40",
            )}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDragging(false);
            }}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              void addFiles(event.dataTransfer.files);
            }}
          >
            <Upload className="size-6 text-muted-foreground" />
            <span className="text-sm font-medium">
              Drop PNGs here or click to browse
            </span>
            <span className="text-xs text-muted-foreground">
              image/png · multiple files
            </span>
            <input
              ref={inputRef}
              id={inputId}
              type="file"
              accept="image/png"
              multiple
              className="sr-only"
              aria-label="PNG frames"
              onChange={(event) => {
                if (event.target.files != null) {
                  void addFiles(event.target.files);
                }
              }}
            />
          </label>

          {frames.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">
                  {frames.length} frame{frames.length === 1 ? "" : "s"}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                >
                  Clear all
                </Button>
              </div>
              <ul
                aria-label="Uploaded frames"
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
              >
                {frames.map((frame, index) => (
                  <li
                    key={frame.id}
                    className="relative overflow-hidden rounded-lg border bg-card"
                  >
                    <div className="flex aspect-square items-center justify-center bg-[linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%),linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%)] bg-[length:16px_16px] bg-[position:0_0,8px_8px] dark:bg-[linear-gradient(45deg,#444_25%,transparent_25%,transparent_75%,#444_75%),linear-gradient(45deg,#444_25%,transparent_25%,transparent_75%,#444_75%)]">
                      <img
                        src={frame.previewUrl}
                        alt={frame.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="space-y-1 p-2">
                      <p className="truncate text-xs font-medium">
                        #{index + 1} · {frame.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {frame.width}×{frame.height}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="absolute top-1 right-1 bg-background/80"
                      aria-label={`Remove frame ${index + 1}`}
                      onClick={() => removeFrame(frame.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}
