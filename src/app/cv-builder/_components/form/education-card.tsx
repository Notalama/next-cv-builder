"use client";

import { Trash2 } from "lucide-react";
import { TextFormField } from "@/app/cv-builder/_components/form/text-form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EducationCardProps } from "@/models/cv-builder";

export function EducationCard({
  index,
  canRemove,
  onRemove,
}: EducationCardProps) {
  return (
    <Card className="relative border-l-primary bg-card shadow-sm transition-all">
      {canRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="absolute top-3 right-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 size={16} />
        </Button>
      )}
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-primary">
          Education #{index + 1}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TextFormField
          name={`education.${index}.institution`}
          label="Institution"
          placeholder="Woolf & GoIT Neoversity"
        />
        <TextFormField
          name={`education.${index}.period`}
          label="Period"
          placeholder="2023 - 2026"
        />
        <TextFormField
          name={`education.${index}.degree`}
          label="Degree"
          placeholder="Master of Science in Computer Science: Software Engineering"
        />
      </CardContent>
    </Card>
  );
}
