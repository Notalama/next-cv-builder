import { z } from "zod";

export interface CvDocumentSummary {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export const renameCvSchema = z.object({
  id: z.string().trim().min(1, "CV id is required"),
  title: z
    .string()
    .trim()
    .min(1, "CV name is required")
    .max(120, "CV name is too long"),
});

export type RenameCvInput = z.infer<typeof renameCvSchema>;
