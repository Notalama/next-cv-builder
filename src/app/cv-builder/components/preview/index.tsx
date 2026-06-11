import { AboutSummary } from "@/app/cv-builder/components/preview/about-summary";
import { ProjectRecords } from "@/app/cv-builder/components/preview/project-records";
import { PreviewSidebar } from "@/app/cv-builder/components/preview/sidebar";
import { TechPrinciples } from "@/app/cv-builder/components/preview/tech-principles";
import type { CvFormValues } from "@/app/cv-builder/schema";

export type CvBuilderPreviewProps = {
  data: CvFormValues;
};

export default function CvBuilderPreview({ data }: CvBuilderPreviewProps) {
  return (
    <div className="cv-preview-root w-full max-w-5xl mx-auto my-4 bg-white p-6 md:p-8 shadow-sm print:shadow-none print:my-0 print:p-0 text-slate-800 antialiased font-sans">
      <div className="flex flex-col md:flex-row gap-8 print:flex-row print:gap-8">
        <PreviewSidebar data={data} />

        <div className="w-full md:w-3/4 print:w-3/4 space-y-6">
          <AboutSummary aboutMe={data.aboutMe} />
          <TechPrinciples techPrinciples={data.techPrinciples} />
          <ProjectRecords projects={data.projects} />
        </div>
      </div>
    </div>
  );
}
