import { BadgeList } from "@/app/cv-builder/_components/preview/badge-list";
import { PreviewSectionHeading } from "@/app/cv-builder/_components/preview/section-heading";
import { splitCommaList } from "@/app/cv-builder/_template";
import type { ProjectRecordsProps } from "@/models/cv-builder";

export function ProjectRecords({ projects }: ProjectRecordsProps) {
  return (
    <div>
      <PreviewSectionHeading
        title="Selected Project Records"
        variant="main"
        className="mb-4"
      />

      <div className="space-y-8">
        {projects.map((project, index) => (
          <div
            className="border-l-2 border-slate-300 pl-4 break-inside-avoid"
            key={`${project.companyName}-${project.period}-${index}`}
          >
            <div className="flex justify-between items-start flex-wrap gap-1 mb-1">
              <h3 className="text-sm font-bold text-slate-900">
                {project.companyName}
              </h3>
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded print:p-0 print:bg-transparent">
                {project.period}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-1.5">
              <strong className="font-semibold text-slate-700">
                Position:
              </strong>{" "}
              {project.position}
            </p>
            <p className="text-sm text-slate-700 leading-normal mb-2">
              <strong className="font-semibold text-slate-800">
                Description & My Role:
              </strong>{" "}
              {project.description}
            </p>
            <BadgeList
              items={splitCommaList(project.technologies)}
              badgeClassName="border border-slate-200"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
