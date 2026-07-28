"use server";

import {
  type GenerateCoverLetterOutcome,
  generateCoverLetter,
} from "@/lib/ai/cover-letter";
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
import {
  type GenerateCoverLetterUiRequest,
  generateCoverLetterUiRequestSchema,
  isCvContentSufficient,
} from "@/models/cover-letter";

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

export async function generateCoverLetterAction(
  raw: GenerateCoverLetterUiRequest,
): Promise<GenerateCoverLetterOutcome> {
  await requireSession();
  const input = generateCoverLetterUiRequestSchema.parse(raw);

  if (!isCvContentSufficient(input.cv)) {
    throw new Error("Fill the CV first (name, role, and about me).");
  }

  return generateCoverLetter({
    input: {
      companyName: input.companyName,
      jobRole: input.cv.role,
      jobDescription: input.jobDescription,
      language: input.language ?? "en",
    },
    cv: input.cv,
  });
}
