"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import cvPreset from "@/app/assets/cv-preset.json";
import CvBuilderForm from "./components/form";
import CvBuilderPreview from "./components/preview";
import { CvBuilderToolbar } from "./components/toolbar";
import { type CvFormValues, cvFormSchema } from "./schema";
import { applySavedResults } from "./utils/apply-saved-results";
import { exportCvPreviewPdf } from "./utils/export-pdf";

export default function CvBuilderPage() {
  const [isPreviewOnly, setIsPreviewOnly] = useState(false);

  const form = useForm<CvFormValues>({
    resolver: zodResolver(cvFormSchema),
    defaultValues: {
      fullName: "",
      role: "",
      photo: "",
      email: "",
      phone: "",
      location: "",
      links: "",
      languages: [{ name: "", level: "" }],
      primarySkills: "",
      secondarySkills: "",
      domains: "",
      aboutMe: "",
      techPrinciples: "",
      projects: [
        {
          companyName: "",
          period: "",
          position: "",
          description: "",
          technologies: "",
        },
      ],
    },
  });

  const previewData = form.watch();
  const applyPresetFromJson = () => {
    const result = applySavedResults(JSON.stringify(cvPreset));

    if (!result.ok) {
      console.error("Invalid CV preset schema:", result.message);
      window.alert(
        "Preset JSON is incompatible with current CV schema. Please update src/app/assets/cv-preset.json.",
      );
      return;
    }

    form.reset(result.data);
  };

  return (
    <div className="flex w-full items-start justify-center gap-4 p-4">
      <FormProvider {...form}>
        {!isPreviewOnly && (
          <div className="cv-builder-chrome shrink-0">
            <CvBuilderForm
              isPreviewOnly={isPreviewOnly}
              onTogglePreviewOnly={() => setIsPreviewOnly(true)}
              onExportPdf={exportCvPreviewPdf}
              onApplyPreset={applyPresetFromJson}
            />
          </div>
        )}
        <div className={isPreviewOnly ? "w-full max-w-5xl" : "shrink-0"}>
          {isPreviewOnly && (
            <div className="cv-builder-chrome mb-4 flex justify-end">
              <CvBuilderToolbar
                isPreviewOnly={isPreviewOnly}
                onTogglePreviewOnly={() => setIsPreviewOnly(false)}
                onExportPdf={exportCvPreviewPdf}
                onApplyPreset={applyPresetFromJson}
              />
            </div>
          )}
          <CvBuilderPreview data={previewData} />
        </div>
      </FormProvider>
    </div>
  );
}
