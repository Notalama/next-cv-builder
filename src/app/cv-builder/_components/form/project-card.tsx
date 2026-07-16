"use client";

import { Trash2 } from "lucide-react";
import { TextFormField } from "@/app/cv-builder/_components/form/text-form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProjectCardProps } from "@/models/cv-builder";

export function ProjectCard({ index, canRemove, onRemove }: ProjectCardProps) {
  return (
    <Card className="relative border-l-primary bg-card shadow-sm transition-all">
      {canRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="absolute top-3 right-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 size={16} />
        </Button>
      )}
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-primary">
          Project #{index + 1}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 space-y-4">
          <TextFormField
            name={`projects.${index}.companyName`}
            label="Company Name"
            placeholder="GlobalLogic, Google, etc."
          />
          <TextFormField
            name={`projects.${index}.period`}
            label="Period of Work"
            placeholder="Jan 2025 - Present"
          />
          <TextFormField
            name={`projects.${index}.position`}
            label="Position on the project"
            placeholder="Front-End Engineer"
          />
        </div>

        <div className="md:col-span-2 space-y-4">
          <TextFormField
            name={`projects.${index}.description`}
            label="Description & Your Role"
            placeholder="Detail what the system does and explicitly what your responsibilities and contributions were..."
            multiline
            inputClassName="min-h-[110px] resize-y"
          />
          <TextFormField
            name={`projects.${index}.technologies`}
            label="Key Technologies Used"
            placeholder="React 19, TypeScript, Nx Monorepo, Tailwind CSS (Comma separated)"
          />
        </div>
      </CardContent>
    </Card>
  );
}
