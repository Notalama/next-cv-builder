import { CvBuilder } from "@/app/cv-builder/_components/cv-builder";
import { getCvDocument } from "@/app/dashboard/actions";
import { ButtonLink } from "@/components/ui/button";
import { requireSession } from "@/lib/auth/session";
import { isFeatureEnabled } from "@/lib/features/flags";

export default async function CvBuilderPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string | string[] }>;
}) {
  const databaseEnabled = isFeatureEnabled("enable_database");
  if (databaseEnabled) {
    await requireSession();
  }

  const params = await searchParams;
  const cvId = typeof params.id === "string" ? params.id : undefined;

  let initialData = null;
  if (databaseEnabled && cvId) {
    const document = await getCvDocument(cvId);
    initialData = document?.data ?? null;
  }

  return (
    <main className="relative h-dvh overflow-hidden print:h-auto print:overflow-visible">
      {databaseEnabled && (
        <div className="cv-hide-on-print absolute top-4 left-4 z-10">
          <ButtonLink href="/dashboard" variant="outline" size="sm">
            Dashboard
          </ButtonLink>
        </div>
      )}
      <CvBuilder cvId={cvId} initialData={initialData} />
    </main>
  );
}
