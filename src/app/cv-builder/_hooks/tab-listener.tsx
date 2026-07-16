"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  getTemplateFieldValue,
  isFieldEmpty,
} from "@/app/cv-builder/_template/utils";
import type { CvFormValues } from "@/models/cv";
import type { FocusedFieldName } from "@/models/cv-builder";

interface UseApplyPlaceholderOnTabKeyArgs {
  fieldName: FocusedFieldName;
}

export function useApplyPlaceholderOnTabKey({
  fieldName,
}: UseApplyPlaceholderOnTabKeyArgs) {
  const { setValue, getValues } = useFormContext<CvFormValues>();

  useEffect(() => {
    if (!fieldName) return;

    function keyDownHandler(event: KeyboardEvent) {
      if (!fieldName) return;

      const templateValue = getTemplateFieldValue(fieldName);
      if (
        event.key === "Tab" &&
        templateValue !== undefined &&
        isFieldEmpty(getValues(fieldName))
      ) {
        event.preventDefault();
        setValue(fieldName, templateValue, {
          shouldDirty: true,
        });
      }
    }

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [fieldName, getValues, setValue]);
}
