import { LANDING_DEMO_CV } from "@/app/_components/landing/demo-cv";
import type { CvPreviewTemplate } from "@/models/cv-builder";

interface TemplatePreviewCardProps {
  label: string;
  Template: CvPreviewTemplate;
}

export function TemplatePreviewCard({
  label,
  Template,
}: TemplatePreviewCardProps) {
  return (
    <li className="flex flex-col items-center gap-3">
      <h3 className="text-base font-medium tracking-tight">{label}</h3>

      {/* Renders the real template at 820px wide and scales it down. Card width
          and height are the scaled dimensions, so nothing is clipped sideways. */}
      <div className="relative h-[470px] w-full max-w-[344px] overflow-hidden rounded-xl border border-border/60 bg-white shadow-xl sm:h-[560px] sm:max-w-[410px]">
        <div
          inert
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 w-[820px] origin-top-left scale-[0.42] select-none sm:scale-[0.5]"
        >
          <Template data={LANDING_DEMO_CV} />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" />
      </div>
    </li>
  );
}
