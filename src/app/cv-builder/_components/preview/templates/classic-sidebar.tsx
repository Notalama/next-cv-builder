import { AboutSummary } from "@/app/cv-builder/_components/preview/about-summary";
import { ProjectRecords } from "@/app/cv-builder/_components/preview/project-records";
import { PreviewSidebar } from "@/app/cv-builder/_components/preview/sidebar";
import { TechPrinciples } from "@/app/cv-builder/_components/preview/tech-principles";
import type { CvPreviewTemplateProps } from "@/models/cv-builder";

export function ClassicSidebarTemplate({ data }: CvPreviewTemplateProps) {
  return (
    <div className="cv-preview-root w-full max-w-5xl mx-auto my-4 bg-white p-10 md:p-10 shadow-sm print:shadow-none print:my-0 print:mx-0 print:max-w-none text-slate-800 antialiased font-sans">
      <div className="flex flex-col md:flex-row gap-8 print:flex-row print:gap-8">
        <PreviewSidebar data={data} />

        <div className="w-full md:w-3/4 print:w-3/4 space-y-6">
          <AboutSummary
            aboutMe={data.aboutMe}
            primarySkills={data.primarySkills}
            secondarySkills={data.secondarySkills}
          />
          <TechPrinciples techPrinciples={data.techPrinciples} />
          <ProjectRecords projects={data.projects} />
        </div>
      </div>
    </div>
  );
}
