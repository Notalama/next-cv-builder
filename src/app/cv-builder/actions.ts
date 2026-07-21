"use server";

import {
  type ImproveTextRequest,
  type ImproveTextResult,
  improveCvText,
} from "@/lib/ai/improve-text";
import { requireSession } from "@/lib/auth/session";

export async function improveCvFieldText(
  input: ImproveTextRequest,
): Promise<ImproveTextResult> {
  await requireSession();
  return improveCvText(input);
}
