import { type CvImportResult, cvFormSchema } from "@/models/cv";

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
