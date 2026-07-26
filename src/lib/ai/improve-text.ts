import { z } from "zod";

export const improveTextRequestSchema = z.object({
  fieldLabel: z.string().min(1),
  fieldPath: z.string().min(1),
  text: z.string().min(1),
  role: z.string().min(1).default("Professional"),
  vacancyText: z.string().trim().min(1).optional(),
});

export type ImproveTextRequest = z.infer<typeof improveTextRequestSchema>;

export type ImproveTextResult = {
  improvedText: string;
  mocked: boolean;
};

const SYSTEM_PROMPT = `You improve CV / resume text for job applications.
Rewrite the user's text to follow hiring best practices for the given target role:
clear impact, strong action verbs, concise wording, and relevant keywords.
Keep the same language as the input. Return only the improved text with no quotes or commentary.`;

const DEFAULT_GEMINI_MODEL = "gemini-3.1-flash-lite";

function buildUserPrompt(input: ImproveTextRequest): string {
  const lines = [
    `Target role: ${input.role}`,
    `CV field: ${input.fieldLabel} (${input.fieldPath})`,
  ];

  if (input.vacancyText != null) {
    lines.push(
      "Target vacancy description (tailor the wording and keywords to it):",
      input.vacancyText,
    );
  }

  lines.push("Original text:", input.text);
  return lines.join("\n");
}

function mockImproveText(input: ImproveTextRequest): ImproveTextResult {
  const context = input.vacancyText != null ? " with vacancy context" : "";
  return {
    improvedText: `[Improved for ${input.role}${context}] ${input.text.trim()}`,
    mocked: true,
  };
}

async function improveWithGemini(
  input: ImproveTextRequest,
): Promise<ImproveTextResult> {
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
          parts: [{ text: buildUserPrompt(input) }],
        },
      ],
      generationConfig: {
        temperature: 0.4,
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
  const improvedText = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();

  if (improvedText == null || improvedText.length === 0) {
    throw new Error("Gemini returned empty improved text.");
  }

  return { improvedText, mocked: false };
}

export async function improveCvText(
  rawInput: ImproveTextRequest,
): Promise<ImproveTextResult> {
  const input = improveTextRequestSchema.parse(rawInput);

  if (
    process.env.AI_IMPROVE_MOCK === "true" ||
    process.env.GEMINI_API_KEY == null ||
    process.env.GEMINI_API_KEY.trim().length === 0
  ) {
    return mockImproveText(input);
  }

  return improveWithGemini(input);
}
