import { z } from "zod";

export const COVER_LETTER_MIN_WORDS = 50;
export const COVER_LETTER_MAX_WORDS = 100;

export const generateCoverLetterInputSchema = z.object({
  cvId: z.string().min(1, "cvId is required"),
  companyName: z.string().min(1, "companyName is required"),
  jobRole: z.string().min(1, "jobRole is required"),
  jobDescription: z.string().trim().min(1).optional(),
  language: z.string().trim().min(1).default("en"),
});

export type GenerateCoverLetterInput = z.infer<
  typeof generateCoverLetterInputSchema
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
