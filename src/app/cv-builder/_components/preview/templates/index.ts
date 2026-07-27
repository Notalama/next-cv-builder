import { ClassicSidebarTemplate } from "@/app/cv-builder/_components/preview/templates/classic-sidebar";
import { MinimalTemplate } from "@/app/cv-builder/_components/preview/templates/minimal";
import type {
  CvPreviewTemplate,
  CvPreviewTemplateId,
} from "@/models/cv-builder";
import {
  type CvFormFieldName,
  fieldsForTemplate,
} from "@/models/cv-template-fields";

export { ClassicSidebarTemplate } from "@/app/cv-builder/_components/preview/templates/classic-sidebar";
export { MinimalTemplate } from "@/app/cv-builder/_components/preview/templates/minimal";

export interface CvPreviewTemplateDescriptor {
  id: CvPreviewTemplateId;
  label: string;
  Component: CvPreviewTemplate;
  fields: readonly CvFormFieldName[];
}

export const CV_PREVIEW_TEMPLATES: Record<
  CvPreviewTemplateId,
  CvPreviewTemplateDescriptor
> = {
  classic: {
    id: "classic",
    label: "Classic Sidebar",
    Component: ClassicSidebarTemplate,
    fields: fieldsForTemplate("classic"),
  },
  minimal: {
    id: "minimal",
    label: "Minimal",
    Component: MinimalTemplate,
    fields: fieldsForTemplate("minimal"),
  },
};

export const DEFAULT_CV_PREVIEW_TEMPLATE_ID: CvPreviewTemplateId = "minimal";
