"use server";

import {
  type GenerateCvRequest,
  type GenerateCvResult,
  generateCvForVacancy,
} from "@/lib/ai/generate-cv";
import {
  type ImproveTextRequest,
  type ImproveTextResult,
  improveCvText,
} from "@/lib/ai/improve-text";
import { requireSession } from "@/lib/auth/session";

export async function improveCvFieldText(
  input: ImproveTextRequest,
): Promise<ImproveTextResult> {
  await requireSession();
  return improveCvText(input);
}

export async function generateCvForVacancyAction(
  input: GenerateCvRequest,
): Promise<GenerateCvResult> {
  await requireSession();
  return generateCvForVacancy(input);
}
