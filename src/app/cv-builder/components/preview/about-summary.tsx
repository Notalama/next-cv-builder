import { PreviewSectionHeading } from "@/app/cv-builder/components/preview/section-heading";

export type AboutSummaryProps = {
  aboutMe: string;
};

export function AboutSummary({ aboutMe }: AboutSummaryProps) {
  return (
    <div className="break-inside-avoid">
      <PreviewSectionHeading
        title="About Me & Experience Summary"
        variant="main"
      />
      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
        {aboutMe}
      </p>
    </div>
  );
}
