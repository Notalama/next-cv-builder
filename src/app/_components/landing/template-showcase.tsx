import { TemplatePreviewCard } from "@/app/_components/landing/template-preview-card";
import { CV_PREVIEW_TEMPLATES } from "@/app/cv-builder/_components/preview/templates";

export function TemplateShowcase() {
  const templates = Object.values(CV_PREVIEW_TEMPLATES);

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Templates, filled in and ready
        </h2>
        <p className="max-w-xl text-pretty text-sm text-muted-foreground">
          Every template below is the same sample profile rendered by the real
          builder — no mockups, no screenshots.
        </p>
      </div>

      <ul className="grid gap-10 lg:grid-cols-2">
        {templates.map(({ id, label, Component }) => (
          <TemplatePreviewCard key={id} label={label} Template={Component} />
        ))}
      </ul>
    </section>
  );
}
