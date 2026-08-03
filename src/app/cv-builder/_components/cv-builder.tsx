"use client";

import { useCallback, useState } from "react";
import {
  CvBuilderSession,
  mergeFormValues,
} from "@/app/cv-builder/_components/cv-builder-session";
import { VacancyProvider } from "@/app/cv-builder/_components/form/vacancy-context";
import { DEFAULT_CV_PREVIEW_TEMPLATE_ID } from "@/app/cv-builder/_components/preview/templates";
import { getCvPresetValues } from "@/app/cv-builder/_utils/apply-saved-results";
import type { CvFormValues } from "@/models/cv";
import type { CvBuilderProps, CvPreviewTemplateId } from "@/models/cv-builder";
import { resolveTemplateId } from "@/models/cv-template-fields";

export function CvBuilder({
  cvId,
  initialData,
  initialTemplateId,
}: CvBuilderProps) {
  const [isPreviewOnly, setIsPreviewOnly] = useState(false);
  const [templateId, setTemplateId] = useState<CvPreviewTemplateId>(() =>
    resolveTemplateId(initialTemplateId ?? DEFAULT_CV_PREVIEW_TEMPLATE_ID),
  );
  const [sessionValues, setSessionValues] = useState<CvFormValues>(() =>
    mergeFormValues(initialData ?? getCvPresetValues()),
  );

  const handleTemplateChange = useCallback(
    (nextTemplateId: CvPreviewTemplateId, values: CvFormValues) => {
      setSessionValues(mergeFormValues(values));
      setTemplateId(nextTemplateId);
    },
    [],
  );

  return (
    <VacancyProvider>
      <CvBuilderSession
        key={templateId}
        cvId={cvId}
        templateId={templateId}
        defaultValues={sessionValues}
        isPreviewOnly={isPreviewOnly}
        onTogglePreviewOnly={() => setIsPreviewOnly((value) => !value)}
        onTemplateChange={handleTemplateChange}
      />
    </VacancyProvider>
  );
}
