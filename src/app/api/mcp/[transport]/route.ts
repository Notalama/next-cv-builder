import { timingSafeEqual } from "node:crypto";
import { createMcpHandler, experimental_withMcpAuth } from "mcp-handler";
import { generateCoverLetter } from "@/lib/ai/cover-letter";
import { getCvDocumentById } from "@/lib/cv/get-cv-for-mcp";
import { generateCoverLetterInputSchema } from "@/models/cover-letter";

export const maxDuration = 10;

function bearerMatchesApiKey(bearerToken: string, apiKey: string): boolean {
  const tokenBuffer = Buffer.from(bearerToken);
  const keyBuffer = Buffer.from(apiKey);
  if (tokenBuffer.length !== keyBuffer.length) {
    return false;
  }
  return timingSafeEqual(tokenBuffer, keyBuffer);
}

const mcpHandler = createMcpHandler(
  (server) => {
    server.registerTool(
      "generate_cover_letter",
      {
        title: "Generate Cover Letter",
        description:
          "Generate an ultra-concise cover letter (50-100 words) from a saved CV, tailored to a company and job role.",
        inputSchema: {
          cvId: generateCoverLetterInputSchema.shape.cvId,
          companyName: generateCoverLetterInputSchema.shape.companyName,
          jobRole: generateCoverLetterInputSchema.shape.jobRole,
          jobDescription: generateCoverLetterInputSchema.shape.jobDescription,
          language: generateCoverLetterInputSchema.shape.language,
        },
      },
      async ({ cvId, companyName, jobRole, jobDescription, language }) => {
        const input = generateCoverLetterInputSchema.parse({
          cvId,
          companyName,
          jobRole,
          jobDescription,
          language,
        });

        const document = await getCvDocumentById(input.cvId);
        if (document == null) {
          return {
            isError: true,
            content: [{ type: "text" as const, text: "CV not found." }],
          };
        }

        try {
          const result = await generateCoverLetter({
            input,
            cv: document.data,
          });

          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({
                  coverLetter: result.coverLetter,
                  wordCount: result.wordCount,
                }),
              },
            ],
          };
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Failed to generate cover letter.";
          return {
            isError: true,
            content: [{ type: "text" as const, text: message }],
          };
        }
      },
    );
  },
  {
    serverInfo: {
      name: "next-cv-builder",
      version: "1.0.0",
    },
  },
  {
    basePath: "/api/mcp",
    maxDuration: 10,
    disableSse: true,
  },
);

const handler = experimental_withMcpAuth(
  mcpHandler,
  async (_req, bearerToken) => {
    const apiKey = process.env.MCP_API_KEY?.trim();
    if (
      apiKey == null ||
      apiKey.length === 0 ||
      bearerToken == null ||
      !bearerMatchesApiKey(bearerToken, apiKey)
    ) {
      return undefined;
    }

    return {
      token: bearerToken,
      clientId: "mcp-api-key",
      scopes: ["cover-letter:generate"],
    };
  },
  { required: true },
);

export { handler as GET, handler as POST, handler as DELETE };
