import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button";

export default function CvBuilderLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <main className="relative h-dvh overflow-hidden print:h-auto print:overflow-visible">
      <div className="cv-hide-on-print absolute top-4 left-4 z-10">
        <ButtonLink href="/dashboard" variant="outline" size="sm">
          Dashboard
        </ButtonLink>
      </div>
      {children}
    </main>
  );
}
