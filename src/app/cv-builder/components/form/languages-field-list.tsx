"use client";

import { Languages, Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { TextFormField } from "@/app/cv-builder/components/form/text-form-field";
import type { CvFormValues } from "@/app/cv-builder/schema";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";

export function LanguagesFieldList() {
  const { control } = useFormContext<CvFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "languages",
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <FormLabel className="text-sm font-medium flex items-center gap-2">
          <Languages size={16} /> Languages & Fluency
        </FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ name: "", level: "" })}
          className="h-8 px-2 text-xs"
        >
          <Plus size={14} className="mr-1" /> Add Language
        </Button>
      </div>

      <div className="space-y-2">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex items-end gap-3 bg-muted/30 p-2 rounded-md border border-muted/50"
          >
            <div className="grid grid-cols-2 gap-2 flex-1">
              <TextFormField
                name={`languages.${index}.name`}
                placeholder="e.g., English"
                itemClassName="space-y-1"
                inputClassName="h-9"
              />
              <TextFormField
                name={`languages.${index}.level`}
                placeholder="e.g., C1 / Fluent"
                itemClassName="space-y-1"
                inputClassName="h-9"
              />
            </div>
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="text-destructive hover:bg-destructive/10 h-9 w-9"
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
