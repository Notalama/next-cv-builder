"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

type VacancyState = {
  vacancyText: string;
  setVacancyText: (value: string) => void;
};

const VacancyContext = createContext<VacancyState | undefined>(undefined);

export function VacancyProvider({ children }: { children: ReactNode }) {
  const [vacancyText, setVacancyText] = useState("");

  return (
    <VacancyContext.Provider value={{ vacancyText, setVacancyText }}>
      {children}
    </VacancyContext.Provider>
  );
}

export function useVacancy(): VacancyState {
  const context = useContext(VacancyContext);

  if (context === undefined) {
    throw new Error("useVacancy must be used within a VacancyProvider");
  }

  return context;
}
