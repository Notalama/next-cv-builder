import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getAuth } from "@/lib/auth/auth";

/** Cached per request so repeated calls in one render share a single lookup. */
export const getServerSession = cache(async () => {
  return getAuth().api.getSession({ headers: await headers() });
});

export async function requireSession(redirectTo = "/auth/login") {
  const session = await getServerSession();
  if (session == null) {
    redirect(redirectTo);
  }
  return session;
}
