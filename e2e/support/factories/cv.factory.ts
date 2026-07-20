import { eq } from "drizzle-orm";
import { cvDocument, user } from "../../../src/drizzle/schema";
import { getTestDb } from "../db";

export async function insertCvForUser(input: {
  userId: string;
  title?: string;
  id?: string;
}) {
  const db = getTestDb();
  const id = input.id ?? crypto.randomUUID();
  const title = input.title ?? "Untitled CV";

  await db.insert(cvDocument).values({
    id,
    userId: input.userId,
    title,
    data: null,
  });

  return { id, title };
}

export async function findUserIdByEmail(email: string) {
  const db = getTestDb();
  const [row] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  return row?.id ?? null;
}
