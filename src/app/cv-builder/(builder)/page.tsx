import { CvBuilder } from "@/app/cv-builder/_components/cv-builder";
import { getCvDocument } from "@/app/dashboard/actions";
import { requireSession } from "@/lib/auth/session";
import type { CvFormValues } from "@/models/cv";
import type { CvPreviewTemplateId } from "@/models/cv-builder";

export default async function CvBuilderPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string | string[] }>;
}) {
  await requireSession();

  const params = await searchParams;
  const cvId = typeof params.id === "string" ? params.id : undefined;

  let initialData: CvFormValues | null = null;
  let initialTemplateId: CvPreviewTemplateId | undefined;
  if (cvId) {
    const document = await getCvDocument(cvId);
    initialData = document?.data ?? null;
    initialTemplateId = document?.templateId;
  }

  return (
    <CvBuilder
      cvId={cvId}
      initialData={initialData}
      initialTemplateId={initialTemplateId}
    />
  );
}
