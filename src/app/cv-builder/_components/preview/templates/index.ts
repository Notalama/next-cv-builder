import { ClassicSidebarTemplate } from "@/app/cv-builder/_components/preview/templates/classic-sidebar";
import { MinimalTemplate } from "@/app/cv-builder/_components/preview/templates/minimal";
import type {
  CvPreviewTemplate,
  CvPreviewTemplateId,
} from "@/models/cv-builder";

export { ClassicSidebarTemplate } from "@/app/cv-builder/_components/preview/templates/classic-sidebar";
export { MinimalTemplate } from "@/app/cv-builder/_components/preview/templates/minimal";

export const CV_PREVIEW_TEMPLATES: Record<
  CvPreviewTemplateId,
  { id: CvPreviewTemplateId; label: string; Component: CvPreviewTemplate }
> = {
  classic: {
    id: "classic",
    label: "Classic Sidebar",
    Component: ClassicSidebarTemplate,
  },
  minimal: {
    id: "minimal",
    label: "Minimal",
    Component: MinimalTemplate,
  },
};

export const DEFAULT_CV_PREVIEW_TEMPLATE_ID: CvPreviewTemplateId = "minimal";
