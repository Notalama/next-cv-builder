"use client";

import { Code } from "lucide-react";
import { LanguagesFieldList } from "@/app/cv-builder/_components/form/languages-field-list";
import { FormSectionHeader } from "@/app/cv-builder/_components/form/section-header";
import { useTemplateFields } from "@/app/cv-builder/_components/form/template-fields-context";
import { TextFormField } from "@/app/cv-builder/_components/form/text-form-field";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const SKILLS_FIELDS = [
  "primarySkills",
  "secondarySkills",
  "skillCategories",
  "domains",
  "languages",
] as const;

export function SkillsSection() {
  const { isConsumed } = useTemplateFields();
  const showLanguages = isConsumed("languages");
  const showSkillInputs = SKILLS_FIELDS.some(
    (name) => name !== "languages" && isConsumed(name),
  );

  if (!SKILLS_FIELDS.some((name) => isConsumed(name))) {
    return null;
  }

  return (
    <Card className="border border-muted bg-card/50 shadow-sm">
      <FormSectionHeader
        icon={Code}
        title="Skills & Competencies"
        description="Core execution stacks, language tracks, and industry knowledge"
      />
      <CardContent className="space-y-6">
        {showSkillInputs && (
          <div className="grid grid-cols-1 gap-4">
            <TextFormField
              name="primarySkills"
              label="Primary Skills"
              placeholder="React, TypeScript, Next.js, Tailwind CSS (Comma separated)"
              improvable
            />
            <TextFormField
              name="secondarySkills"
              label="Secondary Skills"
              placeholder="Node.js, Docker, Webpack, AWS basics (Comma separated)"
            />
            <TextFormField
              name="skillCategories"
              label="Skill Categories"
              placeholder="Frontend Development: React.js, Redux"
              multiline
              inputClassName="min-h-[180px] resize-y font-mono text-xs"
              improvable
            />
            <TextFormField
              name="domains"
              label="Domains of Experience"
              placeholder="E-commerce, FinTech, Automotive Simulation, EdTech (Comma separated)"
            />
          </div>
        )}

        {showSkillInputs && showLanguages && (
          <Separator className="my-4 bg-muted" />
        )}

        {showLanguages && <LanguagesFieldList />}
      </CardContent>
    </Card>
  );
}
