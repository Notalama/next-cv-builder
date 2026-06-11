"use client";

import { Briefcase, Plus } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ProjectCard } from "@/app/cv-builder/components/form/project-card";
import type { CvFormValues } from "@/app/cv-builder/schema";
import { Button } from "@/components/ui/button";

const emptyProject: CvFormValues["projects"][number] = {
  companyName: "",
  period: "",
  position: "",
  description: "",
  technologies: "",
  domain: "",
};

export function ProjectsSection() {
  const { control } = useFormContext<CvFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Briefcase size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Project History
            </h2>
            <p className="text-xs text-muted-foreground">
              Append as many professional projects as needed
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => append(emptyProject)}
          className="gap-1 shadow-sm"
        >
          <Plus size={16} /> Add Project Card
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <ProjectCard
            key={field.id}
            index={index}
            canRemove={fields.length > 1}
            onRemove={() => remove(index)}
          />
        ))}
      </div>
    </div>
  );
}
