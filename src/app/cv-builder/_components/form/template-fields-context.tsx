"use client";

import { createContext, type ReactNode, useContext, useMemo } from "react";
import type { CvPreviewTemplateId } from "@/models/cv-builder";
import {
  type CvFormFieldName,
  fieldsForTemplate,
  topLevelFormField,
} from "@/models/cv-template-fields";

interface TemplateFieldsState {
  templateId: CvPreviewTemplateId;
  fields: readonly CvFormFieldName[];
  isConsumed: (name: string) => boolean;
}

const TemplateFieldsContext = createContext<TemplateFieldsState | undefined>(
  undefined,
);

export function TemplateFieldsProvider({
  templateId,
  children,
}: {
  templateId: CvPreviewTemplateId;
  children: ReactNode;
}) {
  const value = useMemo(() => {
    const fields = fieldsForTemplate(templateId);
    const consumed = new Set<string>(fields);

    return {
      templateId,
      fields,
      isConsumed: (name: string) => {
        const topLevel = topLevelFormField(name);
        return topLevel != null && consumed.has(topLevel);
      },
    };
  }, [templateId]);

  return (
    <TemplateFieldsContext.Provider value={value}>
      {children}
    </TemplateFieldsContext.Provider>
  );
}

export function useTemplateFields(): TemplateFieldsState {
  const context = useContext(TemplateFieldsContext);

  if (context === undefined) {
    throw new Error(
      "useTemplateFields must be used within a TemplateFieldsProvider",
    );
  }

  return context;
}
