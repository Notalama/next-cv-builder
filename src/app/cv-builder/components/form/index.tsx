"use client";

import { useFormContext } from "react-hook-form";
import { ContactSection } from "@/app/cv-builder/components/form/contact-section";
import { FocusedFieldProvider } from "@/app/cv-builder/components/form/focused-field-context";
import { ImportSavedDataCard } from "@/app/cv-builder/components/form/import-saved-data-card";
import { OverviewSection } from "@/app/cv-builder/components/form/overview-section";
import { ProjectsSection } from "@/app/cv-builder/components/form/projects-section";
import { SkillsSection } from "@/app/cv-builder/components/form/skills-section";
import { CvBuilderToolbar } from "@/app/cv-builder/components/toolbar";
import type { CvFormValues } from "@/app/cv-builder/schema";
import { Button } from "@/components/ui/button";

export type CvBuilderFormProps = {
  isPreviewOnly: boolean;
  onTogglePreviewOnly: () => void;
  onExportPdf: () => void;
  onApplyPreset: () => void;
};

export default function CvBuilderForm({
  isPreviewOnly,
  onTogglePreviewOnly,
  onExportPdf,
  onApplyPreset,
}: CvBuilderFormProps) {
  const { handleSubmit } = useFormContext<CvFormValues>();

  const onSubmit = (data: CvFormValues) => {
    console.log("Submitted CV Data:", data);
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
        />
      </div>
      <FocusedFieldProvider>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <ContactSection />
          <OverviewSection />
          <SkillsSection />
          <ProjectsSection />
          <ImportSavedDataCard />
          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto font-medium px-8 shadow-md"
            >
              Save and Compile Data
            </Button>
          </div>
        </form>
      </FocusedFieldProvider>
    </div>
  );
}
