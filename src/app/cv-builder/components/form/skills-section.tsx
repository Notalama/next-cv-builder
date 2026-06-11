"use client";

import { Code } from "lucide-react";
import { LanguagesFieldList } from "@/app/cv-builder/components/form/languages-field-list";
import { FormSectionHeader } from "@/app/cv-builder/components/form/section-header";
import { TextFormField } from "@/app/cv-builder/components/form/text-form-field";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function SkillsSection() {
  return (
    <Card className="border border-muted bg-card/50 shadow-sm">
      <FormSectionHeader
        icon={Code}
        title="Skills & Competencies"
        description="Core execution stacks, language tracks, and industry knowledge"
      />
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <TextFormField
            name="primarySkills"
            label="Primary Skills"
            placeholder="React, TypeScript, Next.js, Tailwind CSS (Comma separated)"
          />
          <TextFormField
            name="secondarySkills"
            label="Secondary Skills"
            placeholder="Node.js, Docker, Webpack, AWS basics (Comma separated)"
          />
          <TextFormField
            name="domains"
            label="Domains of Experience"
            placeholder="E-commerce, FinTech, Automotive Simulation, EdTech (Comma separated)"
          />
        </div>

        <Separator className="my-4 bg-muted" />

        <LanguagesFieldList />
      </CardContent>
    </Card>
  );
}
