"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import CvBuilderForm from "@/app/cv-builder/_components/form";
import { CV_PREVIEW_TEMPLATES } from "@/app/cv-builder/_components/preview/templates";
import { ScrollControls } from "@/app/cv-builder/_components/scroll-controls";
import { CvBuilderToolbar } from "@/app/cv-builder/_components/toolbar";
import { getCvPresetValues } from "@/app/cv-builder/_utils/apply-saved-results";
import { exportCvPreviewPdf } from "@/app/cv-builder/_utils/export-pdf";
import { CV_FORM_DEFAULT_VALUES, type CvFormValues } from "@/models/cv";
import type { CvPreviewTemplateId } from "@/models/cv-builder";
import { schemaForTemplate } from "@/models/cv-template-fields";

export function mergeFormValues(values: CvFormValues): CvFormValues {
  return {
    ...CV_FORM_DEFAULT_VALUES,
    ...values,
    languages: values.languages?.length
      ? values.languages
      : CV_FORM_DEFAULT_VALUES.languages,
    projects: values.projects?.length
      ? values.projects
      : CV_FORM_DEFAULT_VALUES.projects,
    education: values.education?.length
      ? values.education
      : CV_FORM_DEFAULT_VALUES.education,
  };
}

export function CvBuilderSession({
  cvId,
  templateId,
  defaultValues,
  isPreviewOnly,
  onTogglePreviewOnly,
  onTemplateChange,
}: {
  cvId?: string;
  templateId: CvPreviewTemplateId;
  defaultValues: CvFormValues;
  isPreviewOnly: boolean;
  onTogglePreviewOnly: () => void;
  onTemplateChange: (
    nextTemplateId: CvPreviewTemplateId,
    values: CvFormValues,
  ) => void;
}) {
  const formScrollRef = useRef<HTMLDivElement>(null);

  const form = useForm<CvFormValues>({
    resolver: zodResolver(schemaForTemplate(templateId)),
    defaultValues,
  });

  const previewData = form.watch();
  const SelectedTemplate = CV_PREVIEW_TEMPLATES[templateId].Component;

  const applyPresetFromJson = useCallback(() => {
    form.reset(getCvPresetValues());
  }, [form]);

  const clearForm = useCallback(() => {
    form.reset(CV_FORM_DEFAULT_VALUES);
  }, [form]);

  const handleTemplateChange = useCallback(
    (nextTemplateId: CvPreviewTemplateId) => {
      if (nextTemplateId === templateId) {
        return;
      }
      onTemplateChange(nextTemplateId, mergeFormValues(form.getValues()));
    },
    [form, onTemplateChange, templateId],
  );

  return (
    <div className="cv-print-layout flex h-full w-full items-stretch justify-center gap-4 overflow-hidden p-4 print:block print:h-auto print:max-h-none print:overflow-visible print:p-0">
      <FormProvider {...form}>
        {!isPreviewOnly && (
          <div className="relative h-full min-h-0 min-w-0 flex-1">
            <div
              ref={formScrollRef}
              className="cv-hide-on-print scrollbar-hidden h-full min-h-0 overflow-y-auto overscroll-y-contain"
            >
              <CvBuilderForm
                isPreviewOnly={isPreviewOnly}
                onTogglePreviewOnly={onTogglePreviewOnly}
                onExportPdf={exportCvPreviewPdf}
                onApplyPreset={applyPresetFromJson}
                onClearForm={clearForm}
                templateId={templateId}
                onTemplateChange={handleTemplateChange}
                cvId={cvId}
              />
            </div>
            <ScrollControls scrollContainerRef={formScrollRef} />
          </div>
        )}
        <div
          className={`cv-preview-scroll scrollbar-hidden h-full min-h-0 overflow-y-auto overscroll-y-contain ${
            isPreviewOnly ? "w-full max-w-5xl flex-1" : "min-w-0 flex-1"
          }`}
        >
          {isPreviewOnly && (
            <div className="cv-hide-on-print mb-4 flex justify-center">
              <CvBuilderToolbar
                isPreviewOnly={isPreviewOnly}
                onTogglePreviewOnly={onTogglePreviewOnly}
                onExportPdf={exportCvPreviewPdf}
                onApplyPreset={applyPresetFromJson}
                onClearForm={clearForm}
                templateId={templateId}
                onTemplateChange={handleTemplateChange}
              />
            </div>
          )}
          <SelectedTemplate data={previewData} />
        </div>
      </FormProvider>
    </div>
  );
}
