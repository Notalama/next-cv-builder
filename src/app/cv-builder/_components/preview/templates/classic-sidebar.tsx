import { AboutSummary } from "@/app/cv-builder/_components/preview/about-summary";
import { ProjectRecords } from "@/app/cv-builder/_components/preview/project-records";
import { PreviewSectionHeading } from "@/app/cv-builder/_components/preview/section-heading";
import { PreviewSidebar } from "@/app/cv-builder/_components/preview/sidebar";
import { TechPrinciples } from "@/app/cv-builder/_components/preview/tech-principles";
import type { CvEducation } from "@/models/cv";
import type { CvPreviewTemplateProps } from "@/models/cv-builder";

function EducationRecords({ education }: { education: CvEducation[] }) {
  const entries = education.filter(
    (entry) =>
      entry.institution.trim() || entry.period.trim() || entry.degree.trim(),
  );

  if (entries.length === 0) {
    return null;
  }

  return (
    <div>
      <PreviewSectionHeading
        title="Education"
        variant="main"
        className="mb-4"
      />
      <div className="space-y-4">
        {entries.map((entry, index) => (
          <div
            className="break-inside-avoid"
            key={`${entry.institution}-${entry.period}-${index}`}
          >
            <div className="flex justify-between items-start flex-wrap gap-1 mb-1">
              <h3 className="text-sm font-bold text-slate-900">
                {entry.institution}
              </h3>
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded print:p-0 print:bg-transparent">
                {entry.period}
              </span>
            </div>
            <p className="text-sm text-slate-700">{entry.degree}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

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
          <EducationRecords education={data.education} />
        </div>
      </div>
    </div>
  );
}
