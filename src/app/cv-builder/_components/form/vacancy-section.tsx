"use client";

import { Target, Wand2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { FormSectionHeader } from "@/app/cv-builder/_components/form/section-header";
import { useVacancy } from "@/app/cv-builder/_components/form/vacancy-context";
import { generateCvForVacancyAction } from "@/app/cv-builder/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { Textarea } from "@/components/ui/textarea";
import type { CvFormValues } from "@/models/cv";

export function VacancySection() {
  const { vacancyText, setVacancyText } = useVacancy();
  const { reset } = useFormContext<CvFormValues>();
  const [isPending, startTransition] = useTransition();
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = () => {
    const trimmed = vacancyText.trim();
    if (trimmed.length < 10) {
      toast.error("Enter a vacancy description first (at least 10 characters).");
      return;
    }

    setIsGenerating(true);
    startTransition(async () => {
      try {
        const result = await generateCvForVacancyAction({
          vacancyText: trimmed,
        });
        reset(result.data);
        toast.success(
          result.mocked
            ? "CV generated for vacancy (mock AI)"
            : "CV generated for vacancy with Gemini",
        );
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to generate CV",
        );
      } finally {
        setIsGenerating(false);
      }
    });
  };

  return (
    <Card className="border border-muted bg-card/50 shadow-sm">
      <FormSectionHeader
        icon={Target}
        title="Target Vacancy"
        description="Paste a vacancy description to guide AI text improvements or generate a tailored CV"
      />
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="vacancy-description">Vacancy Description</Label>
          <Textarea
            id="vacancy-description"
            value={vacancyText}
            onChange={(event) => setVacancyText(event.target.value)}
            placeholder="Paste the job posting here. It will be used as context for every AI text improvement."
            className="min-h-[120px] resize-y"
          />
        </div>
        <div className="flex justify-end">
          <Button
            type="button"
            variant="secondary"
            className="gap-1.5"
            disabled={isGenerating || isPending}
            aria-label="Generate perfect CV for the vacancy"
            onClick={generate}
          >
            <LoadingSwap isLoading={isGenerating || isPending}>
              <span className="inline-flex items-center gap-1.5">
                <Wand2 className="size-3.5" />
                Generate perfect CV
              </span>
            </LoadingSwap>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
