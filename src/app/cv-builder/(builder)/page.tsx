import { CvBuilder } from "@/app/cv-builder/_components/cv-builder";
import { getCvDocument } from "@/app/dashboard/actions";
import { requireSession } from "@/lib/auth/session";

export default async function CvBuilderPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string | string[] }>;
}) {
  await requireSession();

  const params = await searchParams;
  const cvId = typeof params.id === "string" ? params.id : undefined;

  let initialData = null;
  if (cvId) {
    const document = await getCvDocument(cvId);
    initialData = document?.data ?? null;
  }

  return <CvBuilder cvId={cvId} initialData={initialData} />;
}
