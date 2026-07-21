"use client";

import { Sparkles } from "lucide-react";
import { useState, useTransition } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { improveCvFieldText } from "@/app/cv-builder/actions";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import type { CvFormValues } from "@/models/cv";
import type { CvFieldName } from "@/models/cv-builder";

type ImproveTextButtonProps = {
  fieldPath: CvFieldName;
  fieldLabel: string;
};

export function ImproveTextButton({
  fieldPath,
  fieldLabel,
}: ImproveTextButtonProps) {
  const { getValues, setValue } = useFormContext<CvFormValues>();
  const [isPending, startTransition] = useTransition();
  const [isImproving, setIsImproving] = useState(false);

  const improve = () => {
    const text = String(getValues(fieldPath) ?? "").trim();
    if (text.length === 0) {
      toast.error("Enter some text before improving it.");
      return;
    }

    const role = String(getValues("role") ?? "").trim() || "Professional";

    setIsImproving(true);
    startTransition(async () => {
      try {
        const result = await improveCvFieldText({
          fieldPath,
          fieldLabel,
          text,
          role,
        });
        setValue(fieldPath, result.improvedText, {
          shouldDirty: true,
          shouldValidate: true,
        });
        console.log("result", result);
        toast.success(
          result.mocked
            ? "Text improved (mock AI)"
            : "Text improved with Gemini",
        );
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to improve text",
        );
      } finally {
        setIsImproving(false);
      }
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="gap-1.5"
      disabled={isImproving || isPending}
      aria-label={`Improve ${fieldLabel} text`}
      onClick={improve}
    >
      <LoadingSwap isLoading={isImproving || isPending}>
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="size-3.5" />
          Improve text
        </span>
      </LoadingSwap>
    </Button>
  );
}
