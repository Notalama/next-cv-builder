"use client";

import { type FieldPath, useFormContext } from "react-hook-form";
import { useFocusedField } from "@/app/cv-builder/components/form/focused-field-context";
import type { CvFormValues } from "@/app/cv-builder/schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type TextFormFieldProps = {
  name: FieldPath<CvFormValues>;
  placeholder: string;
  label?: string;
  multiline?: boolean;
  type?: string;
  inputClassName?: string;
  itemClassName?: string;
};

export function TextFormField({
  name,
  placeholder,
  label,
  multiline = false,
  type,
  inputClassName,
  itemClassName,
}: TextFormFieldProps) {
  const { control } = useFormContext<CvFormValues>();
  const { setFocusedField } = useFocusedField();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={itemClassName}>
          {label ? <FormLabel>{label}</FormLabel> : null}
          <FormControl>
            {multiline ? (
              <Textarea
                placeholder={placeholder}
                className={inputClassName}
                {...field}
                value={typeof field.value === "string" ? field.value : ""}
                onFocusCapture={() => setFocusedField(name)}
                onBlur={() => setFocusedField(null)}
              />
            ) : (
              <Input
                type={type}
                placeholder={placeholder}
                className={inputClassName}
                {...field}
                value={typeof field.value === "string" ? field.value : ""}
                onFocusCapture={() => setFocusedField(name)}
                onBlur={() => setFocusedField(null)}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
