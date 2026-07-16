import {
  boldKeywords,
  collectSkillKeywords,
} from "@/app/cv-builder/_components/preview/bold-keywords";
import { PreviewSectionHeading } from "@/app/cv-builder/_components/preview/section-heading";
import type { AboutSummaryProps } from "@/models/cv-builder";

export function AboutSummary({
  aboutMe,
  primarySkills,
  secondarySkills,
}: AboutSummaryProps) {
  const keywords = collectSkillKeywords(primarySkills, secondarySkills);

  return (
    <div className="break-inside-avoid">
      <PreviewSectionHeading
        title="About Me & Experience Summary"
        variant="main"
      />
      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
        {boldKeywords(aboutMe, keywords)}
      </p>
    </div>
  );
}
