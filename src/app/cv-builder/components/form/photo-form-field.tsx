"use client";

import { useFormContext } from "react-hook-form";
import type { CvFormValues } from "@/app/cv-builder/schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

function readFileAsDataUrl(
  file: File | undefined,
  onChange: (value: string) => void,
) {
  if (!file) {
    onChange("");
    return;
  }

  const reader = new FileReader();
  reader.onload = () =>
    onChange(typeof reader.result === "string" ? reader.result : "");
  reader.readAsDataURL(file);
}

export function PhotoFormField() {
  const { control } = useFormContext<CvFormValues>();

  return (
    <FormField
      control={control}
      name="photo"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Photo (Optional)</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="image/*"
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
              onChange={(event) =>
                readFileAsDataUrl(event.target.files?.[0], field.onChange)
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
