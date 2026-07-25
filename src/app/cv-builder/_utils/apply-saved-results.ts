import cvPreset from "@/app/assets/cv-preset.json";
import {
  CV_FORM_DEFAULT_VALUES,
  type CvFormValues,
  type CvImportResult,
  cvFormSchema,
} from "@/models/cv";

export function getCvPresetValues(): CvFormValues {
  const result = applySavedResults(JSON.stringify(cvPreset));
  return result.ok ? result.data : CV_FORM_DEFAULT_VALUES;
}

export function applySavedResults(jsonPayload: string): CvImportResult {
  try {
    const parsed: unknown = JSON.parse(jsonPayload);
    const result = cvFormSchema.safeParse(parsed);

    if (!result.success) {
      return {
        ok: false,
        message:
          "Invalid object format. Please paste a valid saved form JSON object.",
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
