"use client";

import { type FieldErrors, useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ContactSection } from "@/app/cv-builder/_components/form/contact-section";
import { EducationSection } from "@/app/cv-builder/_components/form/education-section";
import { FocusedFieldProvider } from "@/app/cv-builder/_components/form/focused-field-context";
import { ImportSavedDataCard } from "@/app/cv-builder/_components/form/import-saved-data-card";
import { OverviewSection } from "@/app/cv-builder/_components/form/overview-section";
import { ProjectsSection } from "@/app/cv-builder/_components/form/projects-section";
import { SkillsSection } from "@/app/cv-builder/_components/form/skills-section";
import { CvBuilderToolbar } from "@/app/cv-builder/_components/toolbar";
import { saveCvDocument } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import type { CvFormValues } from "@/models/cv";
import type { CvBuilderControlsProps } from "@/models/cv-builder";

export default function CvBuilderForm({
  isPreviewOnly,
  onTogglePreviewOnly,
  onExportPdf,
  onApplyPreset,
  templateId,
  onTemplateChange,
  cvId,
}: CvBuilderControlsProps) {
  const router = useRouter();
  const { handleSubmit } = useFormContext<CvFormValues>();
  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = (data: CvFormValues) => {
    setIsSaving(true);
    startTransition(async () => {
      try {
        const result = await saveCvDocument({ id: cvId, data });
        toast.success("CV saved");
        if (result.id !== cvId) {
          router.replace(`/cv-builder?id=${result.id}`);
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to save CV",
        );
      } finally {
        setIsSaving(false);
      }
    });
  };

  const onInvalid = (errors: FieldErrors<CvFormValues>) => {
    console.log("CV form validation errors:", errors);
    toast.error("Please fix validation errors before saving.");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            CV Blueprint Creator
          </h1>
          <p className="text-muted-foreground text-sm">
            Fill out your professional profiles, skills, and project experience
            below.
          </p>
        </div>
        <CvBuilderToolbar
          isPreviewOnly={isPreviewOnly}
          onTogglePreviewOnly={onTogglePreviewOnly}
          onExportPdf={onExportPdf}
          onApplyPreset={onApplyPreset}
          templateId={templateId}
          onTemplateChange={onTemplateChange}
        />
      </div>
      <FocusedFieldProvider>
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8">
          <ContactSection />
          <OverviewSection />
          <SkillsSection />
          <EducationSection />
          <ProjectsSection />
          <ImportSavedDataCard />
          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={isSaving || isPending}
              className="w-full sm:w-auto font-medium px-8 shadow-md"
            >
              <LoadingSwap isLoading={isSaving || isPending}>
                Save CV
              </LoadingSwap>
            </Button>
          </div>
        </form>
      </FocusedFieldProvider>
    </div>
  );
}
