export const CV_TITLE_MAX_LENGTH = 120;
export const CV_COPY_SUFFIX = " (copy)";

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
