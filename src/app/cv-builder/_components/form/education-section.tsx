"use client";

import { GraduationCap, Plus } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { EducationCard } from "@/app/cv-builder/_components/form/education-card";
import { Button } from "@/components/ui/button";
import { type CvFormValues, EMPTY_CV_EDUCATION } from "@/models/cv";

export function EducationSection() {
  const { control } = useFormContext<CvFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <GraduationCap size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Education</h2>
            <p className="text-xs text-muted-foreground">
              Add academic degrees and certifications
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => append(EMPTY_CV_EDUCATION)}
          className="gap-1 shadow-sm"
        >
          <Plus size={16} /> Add Education
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <EducationCard
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
