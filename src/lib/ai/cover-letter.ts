import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import {
  COVER_LETTER_MAX_WORDS,
  COVER_LETTER_MIN_WORDS,
  type CoverLetterResult,
  countWords,
  coverLetterResultSchema,
  type GenerateCoverLetterInput,
  generateCoverLetterInputSchema,
} from "@/models/cover-letter";
import type { CvFormValues } from "@/models/cv";

const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash";

const generatedLetterSchema = z.object({
  coverLetter: z.string().min(1),
});

export type GenerateCoverLetterParams = {
  input: GenerateCoverLetterInput;
  cv: CvFormValues;
};

export type GenerateCoverLetterOutcome = CoverLetterResult & {
  mocked: boolean;
};

const SYSTEM_PROMPT = `You write ultra-concise cover letters for job applications.
Rules:
- Output between ${COVER_LETTER_MIN_WORDS} and ${COVER_LETTER_MAX_WORDS} words (target 50-70).
- High-impact, direct, tailored to the specific company and role.
- Highlight only the 1-2 most relevant achievements from the CV.
- Zero preamble, zero filler, zero boilerplate intro/outro.
- No greetings like "Dear Hiring Manager" unless required by the language.
- No sign-off blocks. Return only the letter body.`;

function slimCvForPrompt(cv: CvFormValues) {
  return {
    fullName: cv.fullName,
    role: cv.role,
    aboutMe: cv.aboutMe,
    primarySkills: cv.primarySkills,
    secondarySkills: cv.secondarySkills,
    skillCategories: cv.skillCategories,
    domains: cv.domains,
    projects: cv.projects.slice(0, 3).map((project) => ({
      companyName: project.companyName,
      position: project.position,
      period: project.period,
      description: project.description,
      technologies: project.technologies,
    })),
  };
}

function buildUserPrompt(
  input: GenerateCoverLetterInput,
  cv: CvFormValues,
  adjustment?: string,
): string {
  const lines = [
    `Write the cover letter in language: ${input.language}`,
    `Company: ${input.companyName}`,
    `Job role: ${input.jobRole}`,
  ];

  if (input.jobDescription != null) {
    lines.push("Job description / requirements:", input.jobDescription);
  }

  lines.push("Candidate CV (JSON):", JSON.stringify(slimCvForPrompt(cv)));

  if (adjustment != null) {
    lines.push(adjustment);
  }

  return lines.join("\n");
}

function mockCoverLetter(
  input: GenerateCoverLetterInput,
  cv: CvFormValues,
): GenerateCoverLetterOutcome {
  const achievement =
    cv.projects[0]?.description.trim() ||
    cv.aboutMe.trim() ||
    "delivered measurable product impact across multiple releases";
  const skills =
    cv.primarySkills.trim() || cv.role.trim() || "core engineering skills";
  const name = cv.fullName.trim() || "the candidate";
  const role = cv.role.trim() || "this field";

  const sentences = [
    `I am applying for the ${input.jobRole} role at ${input.companyName}.`,
    `As ${name}, specializing in ${role}, I bring ${skills}.`,
    `Most relevant achievement: ${achievement}.`,
    "I focus on concrete outcomes that map directly to your requirements and can contribute from week one.",
    "Recent work shows clear ownership, cross-functional delivery, and measurable results under tight timelines.",
    "I would welcome a short conversation about how this background supports your hiring goals.",
  ];

  let coverLetter = sentences.join(" ");
  const filler =
    " Strong communication, pragmatic trade-offs, and a bias for shipping complete the profile for this opportunity.";

  while (countWords(coverLetter) < COVER_LETTER_MIN_WORDS) {
    coverLetter = `${coverLetter}${filler}`;
  }

  const words = coverLetter.trim().split(/\s+/).filter(Boolean);
  if (words.length > COVER_LETTER_MAX_WORDS) {
    coverLetter = words.slice(0, COVER_LETTER_MAX_WORDS).join(" ");
  }

  const wordCount = countWords(coverLetter);
  const result = coverLetterResultSchema.parse({ coverLetter, wordCount });
  return { ...result, mocked: true };
}

function shouldUseMock(): boolean {
  return (
    process.env.AI_IMPROVE_MOCK === "true" ||
    process.env.GEMINI_API_KEY == null ||
    process.env.GEMINI_API_KEY.trim().length === 0
  );
}

async function generateOnce(
  input: GenerateCoverLetterInput,
  cv: CvFormValues,
  adjustment?: string,
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey == null || apiKey.trim().length === 0) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const google = createGoogleGenerativeAI({ apiKey });
  const modelName = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;

  const { object } = await generateObject({
    model: google(modelName),
    schema: generatedLetterSchema,
    system: SYSTEM_PROMPT,
    prompt: buildUserPrompt(input, cv, adjustment),
    temperature: 0.3,
  });

  return object.coverLetter.trim();
}

function assertWordCount(coverLetter: string): CoverLetterResult {
  const wordCount = countWords(coverLetter);
  return coverLetterResultSchema.parse({ coverLetter, wordCount });
}

export async function generateCoverLetter(
  raw: GenerateCoverLetterParams,
): Promise<GenerateCoverLetterOutcome> {
  const input = generateCoverLetterInputSchema.parse(raw.input);
  const { cv } = raw;

  if (shouldUseMock()) {
    return mockCoverLetter(input, cv);
  }

  const first = await generateOnce(input, cv);
  try {
    return { ...assertWordCount(first), mocked: false };
  } catch {
    const direction =
      countWords(first) < COVER_LETTER_MIN_WORDS
        ? `Your previous draft had ${countWords(first)} words. Expand it to at least ${COVER_LETTER_MIN_WORDS} and at most ${COVER_LETTER_MAX_WORDS} words.`
        : `Your previous draft had ${countWords(first)} words. Shorten it to at most ${COVER_LETTER_MAX_WORDS} and at least ${COVER_LETTER_MIN_WORDS} words.`;

    const second = await generateOnce(input, cv, direction);
    return { ...assertWordCount(second), mocked: false };
  }
}
