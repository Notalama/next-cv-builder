"use server";

import { and, desc, eq, isNotNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/drizzle/db";
import { cvDocument } from "@/drizzle/schema";
import { getAuth } from "@/lib/auth/auth";
import { requireSession } from "@/lib/auth/session";
import type { CvFormValues } from "@/models/cv";
import type { CvDocumentSummary } from "@/models/cv-document";
import type { ActionResult } from "@/models/ui";

function titleFromCvData(data: CvFormValues) {
  const name = data.fullName.trim();
  return name.length > 0 ? name : "Untitled CV";
}

export async function listUserCvs(): Promise<CvDocumentSummary[]> {
  const session = await requireSession();
  const db = getDb();

  return db
    .select({
      id: cvDocument.id,
      title: cvDocument.title,
      createdAt: cvDocument.createdAt,
      updatedAt: cvDocument.updatedAt,
    })
    .from(cvDocument)
    .where(
      and(eq(cvDocument.userId, session.user.id), isNotNull(cvDocument.data)),
    )
    .orderBy(desc(cvDocument.updatedAt));
}

export async function getCvDocument(id: string) {
  const session = await requireSession();
  const db = getDb();

  const [document] = await db
    .select({
      id: cvDocument.id,
      title: cvDocument.title,
      data: cvDocument.data,
    })
    .from(cvDocument)
    .where(and(eq(cvDocument.id, id), eq(cvDocument.userId, session.user.id)))
    .limit(1);

  return document ?? null;
}

export async function saveCvDocument({
  id,
  data,
}: {
  id?: string;
  data: CvFormValues;
}): Promise<{ id: string }> {
  const session = await requireSession();
  const db = getDb();
  const title = titleFromCvData(data);

  if (id) {
    const [existing] = await db
      .select({ id: cvDocument.id })
      .from(cvDocument)
      .where(and(eq(cvDocument.id, id), eq(cvDocument.userId, session.user.id)))
      .limit(1);

    if (existing == null) {
      throw new Error("CV not found.");
    }

    await db
      .update(cvDocument)
      .set({
        title,
        data,
        updatedAt: new Date(),
      })
      .where(eq(cvDocument.id, id));

    return { id };
  }

  const newId = crypto.randomUUID();
  await db.insert(cvDocument).values({
    id: newId,
    userId: session.user.id,
    title,
    data,
  });

  return { id: newId };
}

export async function deleteCvDocument(id: string): Promise<ActionResult> {
  try {
    if (!id.trim()) {
      return { error: true, message: "Failed to delete CV" };
    }

    const session = await requireSession();
    const db = getDb();

    const deleted = await db
      .delete(cvDocument)
      .where(and(eq(cvDocument.id, id), eq(cvDocument.userId, session.user.id)))
      .returning({ id: cvDocument.id });

    if (deleted.length === 0) {
      return { error: true, message: "Failed to delete CV" };
    }

    revalidatePath("/dashboard");
    return { error: false, message: "CV deleted" };
  } catch {
    return { error: true, message: "Failed to delete CV" };
  }
}

export async function signOut() {
  await getAuth().api.signOut({ headers: await headers() });
  redirect("/auth/login");
}
