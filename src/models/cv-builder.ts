import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";
import type { FieldPath } from "react-hook-form";
import type { CvFormValues, CvProject } from "@/models/cv";

export const CV_PREVIEW_TEMPLATE_IDS = ["classic", "minimal"] as const;

export type CvPreviewTemplateId = (typeof CV_PREVIEW_TEMPLATE_IDS)[number];

export interface CvPreviewTemplateProps {
  data: CvFormValues;
}

export type CvPreviewTemplate = ComponentType<CvPreviewTemplateProps>;

/** Shared toolbar/form controls of the CV builder page. */
export interface CvBuilderControlsProps {
  isPreviewOnly: boolean;
  onTogglePreviewOnly: () => void;
  onExportPdf: () => void;
  onApplyPreset: () => void;
  templateId: CvPreviewTemplateId;
  onTemplateChange: (templateId: CvPreviewTemplateId) => void;
  cvId?: string;
}

export type CvFieldName = FieldPath<CvFormValues>;

export type FocusedFieldName = CvFieldName | null;

export interface FocusedFieldState {
  focusedField: FocusedFieldName;
  setFocusedField: (name: FocusedFieldName) => void;
}

export interface TextFormFieldProps {
  name: CvFieldName;
  placeholder: string;
  label?: string;
  multiline?: boolean;
  type?: string;
  inputClassName?: string;
  itemClassName?: string;
}

export interface CvTextFieldConfig {
  name: CvFieldName;
  label: string;
  placeholder: string;
}

export interface FormSectionHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface ProjectCardProps {
  index: number;
  canRemove: boolean;
  onRemove: () => void;
}

export interface EducationCardProps {
  index: number;
  canRemove: boolean;
  onRemove: () => void;
}

export interface AboutSummaryProps {
  aboutMe: string;
  primarySkills: string;
  secondarySkills?: string;
}

export interface TechPrinciplesProps {
  techPrinciples: string;
}

/** A single "Title: description" line parsed from the tech principles textarea. */
export interface CvPrincipleLine {
  line: string;
  title: string;
  description: string;
}

export interface ProjectRecordsProps {
  projects: CvProject[];
}

export interface PreviewSidebarProps {
  data: CvFormValues;
}

export interface PhotoBlockProps {
  photo?: string;
  fullName: string;
}

export interface BadgeListProps {
  items: string[];
  badgeClassName?: string;
}

export interface ContactLinkProps {
  label: string;
  url: string;
}

export interface PreviewSectionHeadingProps {
  title: string;
  variant: "sidebar" | "main";
  className?: string;
}

export interface CvBuilderProps {
  cvId?: string;
  initialData?: CvFormValues | null;
}
