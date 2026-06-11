"use client";

import { createContext, type ReactNode, useContext, useState } from "react";
import type { FieldPath } from "react-hook-form";
import { useApplyPlaceholderOnTabKey } from "@/app/cv-builder/hooks/tab-listener";
import type { CvFormValues } from "@/app/cv-builder/schema";

export type FocusedFieldName = FieldPath<CvFormValues> | null;

type FocusedFieldState = {
  focusedField: FocusedFieldName;
  setFocusedField: (name: FocusedFieldName) => void;
};

const FocusedFieldContext = createContext<FocusedFieldState | undefined>(
  undefined,
);

export function FocusedFieldProvider({ children }: { children: ReactNode }) {
  const [focusedField, setFocusedField] = useState<FocusedFieldName>(null);

  useApplyPlaceholderOnTabKey({
    fieldName: focusedField,
  });

  return (
    <FocusedFieldContext.Provider value={{ focusedField, setFocusedField }}>
      {children}
    </FocusedFieldContext.Provider>
  );
}

export function useFocusedField(): FocusedFieldState {
  const context = useContext(FocusedFieldContext);

  if (context === undefined) {
    throw new Error(
      "useFocusedField must be used within a FocusedFieldProvider",
    );
  }

  return context;
}
