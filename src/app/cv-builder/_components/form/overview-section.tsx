"use client";

import { Globe } from "lucide-react";
import { FormSectionHeader } from "@/app/cv-builder/_components/form/section-header";
import { TextFormField } from "@/app/cv-builder/_components/form/text-form-field";
import { Card, CardContent } from "@/components/ui/card";

export function OverviewSection() {
  return (
    <Card className="border border-muted bg-card/50 shadow-sm">
      <FormSectionHeader
        icon={Globe}
        title="Professional Overview"
        description="Describe your background and core philosophies"
      />
      <CardContent className="space-y-4">
        <TextFormField
          name="aboutMe"
          label="About Me / Experience Summary"
          placeholder="Brief overview of your architectural history, years of experience, and general background..."
          multiline
          inputClassName="min-h-[100px]"
        />
        <TextFormField
          name="techPrinciples"
          label="Technical Principles"
          placeholder="e.g., Clean Architecture, Type Safety, Performance-first rendering, Scalable Monorepos..."
          multiline
          inputClassName="min-h-[80px]"
        />
      </CardContent>
    </Card>
  );
}
