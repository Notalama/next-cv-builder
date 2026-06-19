import type { CvFormValues } from "@/app/cv-builder/schema";
import { cvFormSchema } from "@/app/cv-builder/schema";

type ApplySavedResultsResult =
  | { ok: true; data: CvFormValues }
  | { ok: false; message: string };

export function applySavedResults(jsonPayload: string): ApplySavedResultsResult {
  try {
    const parsed = JSON.parse(jsonPayload);
    const result = cvFormSchema.safeParse(parsed);

    if (!result.success) {
      return {
        ok: false,
        message: "Invalid object format. Please paste a valid saved form JSON object.",
      };
    }

    return { ok: true, data: result.data };
  } catch {
    return {
      ok: false,
      message: "Invalid JSON. Please paste a valid JSON object.",
    };
  }
}
