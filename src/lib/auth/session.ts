import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth/auth";

export async function getServerSession() {
  return getAuth().api.getSession({ headers: await headers() });
}

export async function requireSession(redirectTo = "/auth/login") {
  const session = await getServerSession();
  if (session == null) {
    redirect(redirectTo);
  }
  return session;
}
