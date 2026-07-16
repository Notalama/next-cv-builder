"use client";

import { useFormContext } from "react-hook-form";
import { useFocusedField } from "@/app/cv-builder/_components/form/focused-field-context";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CvFormValues } from "@/models/cv";
import type { TextFormFieldProps } from "@/models/cv-builder";

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
