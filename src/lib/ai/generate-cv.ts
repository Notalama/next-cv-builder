import { z } from "zod";
import cvPreset from "@/app/assets/cv-preset.json";
import { type CvFormValues, cvFormSchema } from "@/models/cv";

export const generateCvRequestSchema = z.object({
  vacancyText: z.string().trim().min(10, "Vacancy description is too short"),
});

export type GenerateCvRequest = z.infer<typeof generateCvRequestSchema>;

export type GenerateCvResult = {
  data: CvFormValues;
  mocked: boolean;
};

const SYSTEM_PROMPT = `You generate a complete CV / resume for a candidate applying to a specific vacancy.
Write the CV as if the candidate perfectly matches every requirement of the vacancy:
role, seniority, skills, domains, and project experience must all align with it.
Return ONLY a JSON object (no markdown, no commentary) with exactly these keys:
fullName (string), role (string), photo (string, may be empty), email (string), phone (string),
location (string), links (string), languages (array of { name, level }),
primarySkills (string, comma separated), secondarySkills (string, comma separated),
skillCategories (string, newline separated "Category: items" lines),
domains (string, comma separated), aboutMe (string), techPrinciples (string),
projects (array of { companyName, period, position, description, technologies, domain }),
education (array of { institution, period, degree }).
Every project description must be at least 10 characters and showcase vacancy-relevant achievements.`;

const DEFAULT_GEMINI_MODEL = "gemini-3.1-flash-lite";

function mockGenerateCv(): GenerateCvResult {
  const preset = cvFormSchema.parse(cvPreset);
  return {
    data: {
      ...preset,
      aboutMe: `[Tailored to vacancy] ${preset.aboutMe}`,
    },
    mocked: true,
  };
}

function extractJson(text: string): unknown {
  const trimmed = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  return JSON.parse(trimmed);
}

async function generateWithGemini(
  input: GenerateCvRequest,
): Promise<GenerateCvResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey == null || apiKey.trim().length === 0) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
  const url = new URL(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
  );
  url.searchParams.set("key", apiKey);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: `Vacancy description:\n${input.vacancyText}` }],
        },
      ],
      generationConfig: {
        temperature: 0.5,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini request failed (${response.status}): ${body}`);
  }

  const payload = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };
  const rawText = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();

  if (rawText == null || rawText.length === 0) {
    throw new Error("Gemini returned an empty CV.");
  }

  const parsed = cvFormSchema.safeParse(extractJson(rawText));
  if (!parsed.success) {
    throw new Error("Gemini returned a CV that does not match the schema.");
  }

  return { data: parsed.data, mocked: false };
}

export async function generateCvForVacancy(
  rawInput: GenerateCvRequest,
): Promise<GenerateCvResult> {
  const input = generateCvRequestSchema.parse(rawInput);

  if (
    process.env.AI_IMPROVE_MOCK === "true" ||
    process.env.GEMINI_API_KEY == null ||
    process.env.GEMINI_API_KEY.trim().length === 0
  ) {
    return mockGenerateCv();
  }

  return generateWithGemini(input);
}
