import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import { isFeatureEnabled } from "@/lib/features/flags";

export default async function Home() {
  if (!isFeatureEnabled("enable_database")) {
    redirect("/cv-builder");
  }

  const session = await getServerSession();
  redirect(session != null ? "/dashboard" : "/auth/login");
}
