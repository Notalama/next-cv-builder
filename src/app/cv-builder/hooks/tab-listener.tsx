"use client";

import { useEffect } from "react";
import { type FieldPath, useFormContext } from "react-hook-form";
import type { CvFormValues } from "@/app/cv-builder/schema";
import { getTemplateFieldValue } from "@/app/cv-builder/template/utils";

interface UseApplyPlaceholderOnTabKeyArgs {
  fieldName: FieldPath<CvFormValues> | null;
}

export function useApplyPlaceholderOnTabKey({
  fieldName,
}: UseApplyPlaceholderOnTabKeyArgs) {
  const { setValue, getFieldState } = useFormContext<CvFormValues>();
  useEffect(() => {
    function keyDownHandler(e: globalThis.KeyboardEvent) {
      if (!fieldName) return;
      if (e.key === "Tab" && !getFieldState(fieldName).isDirty) {
        e.preventDefault();
        setValue(fieldName, getTemplateFieldValue(fieldName), {
          shouldDirty: true,
        });
      }
    }

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [fieldName, getFieldState, setValue]);
}
