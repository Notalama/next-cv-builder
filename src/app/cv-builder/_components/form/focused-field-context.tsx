"use client";

import { createContext, type ReactNode, useContext, useState } from "react";
import { useApplyPlaceholderOnTabKey } from "@/app/cv-builder/_hooks/tab-listener";
import type { FocusedFieldName, FocusedFieldState } from "@/models/cv-builder";

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
