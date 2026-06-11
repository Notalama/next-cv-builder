"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { type CvFormValues, cvFormSchema } from "@/app/cv-builder/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function ImportSavedDataCard() {
  const [savedFormPayload, setSavedFormPayload] = useState("");
  const [importError, setImportError] = useState<string | null>(null);

  const { reset } = useFormContext<CvFormValues>();

  const applySavedResults = () => {
    setImportError(null);

    try {
      const parsed = JSON.parse(savedFormPayload);
      const result = cvFormSchema.safeParse(parsed);

      if (!result.success) {
        setImportError(
          "Invalid object format. Please paste a valid saved form JSON object.",
        );
        return;
      }

      reset(result.data);
    } catch {
      setImportError("Invalid JSON. Please paste a valid JSON object.");
    }
  };

  return (
    <Card className="border border-muted bg-card/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Import Saved Form Data</CardTitle>
        <CardDescription>
          Paste a previously saved CV object (JSON) and apply it to all fields.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          value={savedFormPayload}
          onChange={(event) => setSavedFormPayload(event.target.value)}
          className="min-h-[140px] font-mono text-xs"
          placeholder='{"fullName":"John Doe","position":"Lead Front-End Engineer", "...":"..."}'
        />
        {importError ? (
          <p className="text-sm text-destructive">{importError}</p>
        ) : null}
        <Button type="button" variant="outline" onClick={applySavedResults}>
          Apply Saved Results
        </Button>
      </CardContent>
    </Card>
  );
}
