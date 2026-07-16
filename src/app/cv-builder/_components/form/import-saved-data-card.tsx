"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { applySavedResults } from "@/app/cv-builder/_utils/apply-saved-results";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { CvFormValues } from "@/models/cv";

export function ImportSavedDataCard() {
  const [savedFormPayload, setSavedFormPayload] = useState("");
  const [importError, setImportError] = useState<string | null>(null);

  const { reset } = useFormContext<CvFormValues>();

  const handleApplySavedResults = () => {
    setImportError(null);
    const result = applySavedResults(savedFormPayload);

    if (!result.ok) {
      setImportError(result.message);
      return;
    }

    reset(result.data);
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
        <Button
          type="button"
          variant="outline"
          onClick={handleApplySavedResults}
        >
          Apply Saved Results
        </Button>
      </CardContent>
    </Card>
  );
}
