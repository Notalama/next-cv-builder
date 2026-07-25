import { Skeleton } from "@/components/ui/skeleton";

const FORM_SECTIONS = [
  { id: "contact", fields: ["full-name", "role", "email", "phone"] },
  { id: "overview", fields: ["summary", "principles"] },
  { id: "skills", fields: ["primary", "secondary", "languages", "tools"] },
] as const;

const PREVIEW_BADGES = [
  "react",
  "typescript",
  "next",
  "node",
  "testing",
  "tooling",
  "css",
  "ci",
] as const;

function FormSectionSkeleton({ fields }: { fields: readonly string[] }) {
  return (
    <div className="space-y-4 rounded-xl border bg-card p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="size-9 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field} className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CvBuilderLoading() {
  return (
    <div className="cv-print-layout flex h-full w-full items-stretch justify-center gap-4 overflow-hidden p-4">
      <div className="relative h-full min-h-0 min-w-0 flex-1">
        <div className="h-full min-h-0 overflow-hidden">
          <div className="mx-auto max-w-4xl space-y-8 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-9 w-72" />
                <Skeleton className="h-4 w-96 max-w-full" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
            {FORM_SECTIONS.map((section) => (
              <FormSectionSkeleton key={section.id} fields={section.fields} />
            ))}
          </div>
        </div>
      </div>

      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="mx-auto aspect-[1/1.414] w-full max-w-3xl space-y-6 rounded-xl border bg-card p-10">
          <div className="space-y-3">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
          <div className="space-y-3 pt-4">
            <Skeleton className="h-5 w-40" />
            <div className="flex flex-wrap gap-2">
              {PREVIEW_BADGES.map((badge) => (
                <Skeleton key={badge} className="h-6 w-20 rounded-full" />
              ))}
            </div>
          </div>
          <div className="space-y-3 pt-4">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}
