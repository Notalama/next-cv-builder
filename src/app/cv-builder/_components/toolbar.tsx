"use client";

import {
  BookOpenText,
  ChevronDown,
  Eraser,
  Eye,
  FileDown,
  PanelLeftOpen,
} from "lucide-react";
import { CV_PREVIEW_TEMPLATES } from "@/app/cv-builder/_components/preview/templates";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CvBuilderControlsProps } from "@/models/cv-builder";

export function CvBuilderToolbar({
  isPreviewOnly,
  onTogglePreviewOnly,
  onExportPdf,
  onApplyPreset,
  onClearForm,
  templateId,
  onTemplateChange,
}: CvBuilderControlsProps) {
  const selectedTemplate = CV_PREVIEW_TEMPLATES[templateId];

  return (
    <div className="flex shrink-0 flex-wrap gap-2 ps-8">
      <ButtonLink
        href="/cv-builder/speed-reader"
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <BookOpenText className="size-4" />
        Speed reader
      </ButtonLink>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline" size="sm" className="gap-2">
            {selectedTemplate.label}
            <ChevronDown className="size-4 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-background">
          <DropdownMenuLabel>Preview template</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={templateId}
            onValueChange={(value) =>
              onTemplateChange(value as typeof templateId)
            }
          >
            {Object.values(CV_PREVIEW_TEMPLATES).map((template) => (
              <DropdownMenuRadioItem key={template.id} value={template.id}>
                {template.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={onApplyPreset}
      >
        Apply preset
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={onClearForm}
      >
        <Eraser className="size-4" />
        Clear form
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={onTogglePreviewOnly}
      >
        {isPreviewOnly ? (
          <>
            <PanelLeftOpen className="size-4" />
            Show form
          </>
        ) : (
          <>
            <Eye className="size-4" />
            Preview only
          </>
        )}
      </Button>
      {isPreviewOnly && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={onExportPdf}
        >
          <FileDown className="size-4" />
          Export PDF
        </Button>
      )}
    </div>
  );
}
