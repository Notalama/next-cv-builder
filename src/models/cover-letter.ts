import { z } from "zod";
import type { CvFormValues } from "@/models/cv";

export const COVER_LETTER_MIN_WORDS = 50;
export const COVER_LETTER_MAX_WORDS = 100;

export const coverLetterPromptInputSchema = z.object({
  companyName: z.string().min(1, "companyName is required"),
  jobRole: z.string().min(1, "jobRole is required"),
  jobDescription: z.string().trim().min(1).optional(),
  language: z.string().trim().min(1).default("en"),
});

export type CoverLetterPromptInput = z.infer<
  typeof coverLetterPromptInputSchema
>;

export const generateCoverLetterInputSchema =
  coverLetterPromptInputSchema.extend({
    cvId: z.string().min(1, "cvId is required"),
  });

export type GenerateCoverLetterInput = z.infer<
  typeof generateCoverLetterInputSchema
>;

export const generateCoverLetterUiRequestSchema = z.object({
  companyName: z.string().trim().min(1, "companyName is required"),
  jobDescription: z.string().trim().min(10, "Vacancy description is too short"),
  language: z.string().trim().min(1).optional(),
  cv: z.custom<CvFormValues>(),
});

export type GenerateCoverLetterUiRequest = z.infer<
  typeof generateCoverLetterUiRequestSchema
>;

export const coverLetterResultSchema = z.object({
  coverLetter: z.string().min(1),
  wordCount: z
    .number()
    .int()
    .min(COVER_LETTER_MIN_WORDS)
    .max(COVER_LETTER_MAX_WORDS),
});

export type CoverLetterResult = z.infer<typeof coverLetterResultSchema>;

export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((token) => token.length > 0).length;
}

export function isCvContentSufficient(cv: CvFormValues): boolean {
  return (
    cv.fullName.trim().length >= 2 &&
    cv.role.trim().length >= 2 &&
    cv.aboutMe.trim().length >= 10
  );
}
