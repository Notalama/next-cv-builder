import { useEffect, useState } from "react";
import { AboutSummary } from "@/app/cv-builder/components/preview/about-summary";
import { ProjectRecords } from "@/app/cv-builder/components/preview/project-records";
import { PreviewSidebar } from "@/app/cv-builder/components/preview/sidebar";
import { TechPrinciples } from "@/app/cv-builder/components/preview/tech-principles";
import type { CvFormValues } from "@/app/cv-builder/schema";

export type CvBuilderPreviewProps = {
  data: CvFormValues;
};

export default function CvBuilderPreview({ data }: CvBuilderPreviewProps) {
  const [hideCounter, setHideCounter] = useState(() => false);
  return (
    <div className="cv-preview-root w-full max-w-5xl mx-auto my-4 bg-white p-10 md:p-10 shadow-sm print:shadow-none print:my-0 print:mx-0 print:max-w-none text-slate-800 antialiased font-sans">
      <div className="flex flex-col md:flex-row gap-8 print:flex-row print:gap-8">
        <PreviewSidebar data={data} />

        <div className="w-full md:w-3/4 print:w-3/4 space-y-6">
          <div className="flex items-center gap-2">
            {!hideCounter && <Counter />}
            <button
              type="button"
              onClick={() => setHideCounter(!hideCounter)}
              className="rounded border border-slate-300 px-3 py-1 text-sm"
            >
              {hideCounter ? "Show Counter" : "Hide Counter"}
            </button>
          </div>
          <AboutSummary aboutMe={data.aboutMe} />
          <TechPrinciples techPrinciples={data.techPrinciples} />
          <ProjectRecords projects={data.projects} />
        </div>
      </div>
    </div>
  );
}

function Counter() {
  const [counter, setCounter] = useState(() => 0);

  useEffect(() => {
    console.log("rerender", counter);
    return () => {
      console.log("cleanup", counter);
    };
  }, [counter]);
  return (
    <>
      <span>{counter}</span>
      <button
        type="button"
        onClick={() => setCounter(counter + 1)}
        className="rounded border border-slate-300 px-3 py-1 text-sm"
      >
        +
      </button>
      <button
        type="button"
        onClick={() => setCounter(counter - 1)}
        className="rounded border border-slate-300 px-3 py-1 text-sm"
      >
        -
      </button>
    </>
  );
}
