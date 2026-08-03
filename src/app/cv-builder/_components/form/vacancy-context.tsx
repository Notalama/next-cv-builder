"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

type VacancyState = {
  vacancyText: string;
  setVacancyText: (value: string) => void;
  companyName: string;
  setCompanyName: (value: string) => void;
  coverLetter: string;
  setCoverLetter: (value: string) => void;
  wordCount: number | null;
  setWordCount: (value: number | null) => void;
};

const VacancyContext = createContext<VacancyState | undefined>(undefined);

export function VacancyProvider({ children }: { children: ReactNode }) {
  const [vacancyText, setVacancyText] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [wordCount, setWordCount] = useState<number | null>(null);

  return (
    <VacancyContext.Provider
      value={{
        vacancyText,
        setVacancyText,
        companyName,
        setCompanyName,
        coverLetter,
        setCoverLetter,
        wordCount,
        setWordCount,
      }}
    >
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
