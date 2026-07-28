import { eq } from "drizzle-orm";
import { getDb } from "@/drizzle/db";
import { cvDocument } from "@/drizzle/schema";
import type { CvFormValues } from "@/models/cv";

export type CvDocumentForMcp = {
  id: string;
  title: string;
  data: CvFormValues;
};

export async function getCvDocumentById(
  cvId: string,
): Promise<CvDocumentForMcp | null> {
  const db = getDb();
  const [document] = await db
    .select({
      id: cvDocument.id,
      title: cvDocument.title,
      data: cvDocument.data,
    })
    .from(cvDocument)
    .where(eq(cvDocument.id, cvId))
    .limit(1);

  if (document == null || document.data == null) {
    return null;
  }

  return {
    id: document.id,
    title: document.title,
    data: document.data,
  };
}
