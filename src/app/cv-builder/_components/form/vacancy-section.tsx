"use client";

import { FileText, Target, Wand2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { FormSectionHeader } from "@/app/cv-builder/_components/form/section-header";
import { useVacancy } from "@/app/cv-builder/_components/form/vacancy-context";
import {
  generateCoverLetterAction,
  generateCvForVacancyAction,
} from "@/app/cv-builder/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { Textarea } from "@/components/ui/textarea";
import { isCvContentSufficient } from "@/models/cover-letter";
import type { CvFormValues } from "@/models/cv";

export function VacancySection() {
  const { vacancyText, setVacancyText } = useVacancy();
  const { reset, getValues } = useFormContext<CvFormValues>();
  const [companyName, setCompanyName] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [wordCount, setWordCount] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isGeneratingCv, setIsGeneratingCv] = useState(false);
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);

  const busy = isGeneratingCv || isGeneratingLetter || isPending;

  const generate = () => {
    const trimmed = vacancyText.trim();
    if (trimmed.length < 10) {
      toast.error(
        "Enter a vacancy description first (at least 10 characters).",
      );
      return;
    }

    setIsGeneratingCv(true);
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
        setIsGeneratingCv(false);
      }
    });
  };

  const generateLetter = () => {
    const trimmedVacancy = vacancyText.trim();
    if (trimmedVacancy.length < 10) {
      toast.error(
        "Enter a vacancy description first (at least 10 characters).",
      );
      return;
    }

    const trimmedCompany = companyName.trim();
    if (trimmedCompany.length === 0) {
      toast.error("Enter a company name first.");
      return;
    }

    const cv = getValues();
    if (!isCvContentSufficient(cv)) {
      toast.error("Fill the CV first (name, role, and about me).");
      return;
    }

    setIsGeneratingLetter(true);
    startTransition(async () => {
      try {
        const result = await generateCoverLetterAction({
          companyName: trimmedCompany,
          jobDescription: trimmedVacancy,
          cv,
        });
        setCoverLetter(result.coverLetter);
        setWordCount(result.wordCount);
        toast.success(
          result.mocked
            ? "Cover letter generated (mock AI)"
            : "Cover letter generated with Gemini",
        );
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to generate cover letter",
        );
      } finally {
        setIsGeneratingLetter(false);
      }
    });
  };

  return (
    <Card className="border border-muted bg-card/50 shadow-sm">
      <FormSectionHeader
        icon={Target}
        title="Target Vacancy"
        description="Paste a vacancy description to guide AI text improvements, generate a tailored CV, or draft a cover letter"
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
        <div className="space-y-2">
          <Label htmlFor="vacancy-company-name">Company name</Label>
          <Input
            id="vacancy-company-name"
            aria-label="Company name"
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            placeholder="Company you are applying to"
            autoComplete="organization"
          />
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            className="gap-1.5"
            disabled={busy}
            aria-label="Generate perfect CV for the vacancy"
            onClick={generate}
          >
            <LoadingSwap isLoading={isGeneratingCv}>
              <span className="inline-flex items-center gap-1.5">
                <Wand2 className="size-3.5" />
                Generate perfect CV
              </span>
            </LoadingSwap>
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="gap-1.5"
            disabled={busy}
            aria-label="Generate cover letter"
            onClick={generateLetter}
          >
            <LoadingSwap isLoading={isGeneratingLetter}>
              <span className="inline-flex items-center gap-1.5">
                <FileText className="size-3.5" />
                Generate cover letter
              </span>
            </LoadingSwap>
          </Button>
        </div>
        {coverLetter.length > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="generated-cover-letter">
                Generated cover letter
              </Label>
              {wordCount != null ? (
                <span className="text-muted-foreground text-xs">
                  {wordCount} words
                </span>
              ) : null}
            </div>
            <Textarea
              id="generated-cover-letter"
              aria-label="Generated cover letter"
              value={coverLetter}
              readOnly
              className="min-h-[140px] resize-y"
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
