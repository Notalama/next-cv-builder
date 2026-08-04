export const CV_TITLE_MAX_LENGTH = 120;
export const CV_COPY_SUFFIX = " (copy)";
import { z } from "zod";

export interface CvDocumentSummary {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export function titleWithCopySuffix(baseTitle: string): string {
  const trimmed = baseTitle.trim() || "Untitled CV";
  const maxBaseLength = CV_TITLE_MAX_LENGTH - CV_COPY_SUFFIX.length;
  const base =
    trimmed.length > maxBaseLength
      ? trimmed.slice(0, maxBaseLength).trimEnd()
      : trimmed;
  return `${base}${CV_COPY_SUFFIX}`;
}
export const renameCvSchema = z.object({
  id: z.string().trim().min(1, "CV id is required"),
  title: z
    .string()
    .trim()
    .min(1, "CV name is required")
    .max(120, "CV name is too long"),
});

export type RenameCvInput = z.infer<typeof renameCvSchema>;
