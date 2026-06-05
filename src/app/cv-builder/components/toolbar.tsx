import { Eye, FileDown, PanelLeftOpen } from 'lucide-react';

import { Button } from '@/components/ui/button';

type CvBuilderToolbarProps = {
  isPreviewOnly: boolean;
  onTogglePreviewOnly: () => void;
  onExportPdf: () => void;
};

export function CvBuilderToolbar({
  isPreviewOnly,
  onTogglePreviewOnly,
  onExportPdf,
}: CvBuilderToolbarProps) {
  return (
    <div className="flex shrink-0 flex-wrap gap-2">
      <Button type="button" variant="outline" size="sm" className="gap-2" onClick={onTogglePreviewOnly}>
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
      {isPreviewOnly && <Button type="button" variant="outline" size="sm" className="gap-2" onClick={onExportPdf}>
        <FileDown className="size-4" />
        Export PDF
      </Button>}
    </div>
  );
}
