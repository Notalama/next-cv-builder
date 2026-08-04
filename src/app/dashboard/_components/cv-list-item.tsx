"use client";

import { Copy, FileText, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteCvDocument, duplicateCvDocument } from "@/app/dashboard/actions";
import { ActionButton } from "@/components/ui/action-button";

interface CvListItemProps {
  id: string;
  title: string;
  updatedLabel: string;
}

export function CvListItem({ id, title, updatedLabel }: CvListItemProps) {
  return (
    <li className="flex items-center gap-1 pr-2">
      <Link
        href={`/cv-builder?id=${id}`}
        className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/60"
      >
        <FileText className="size-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{updatedLabel}</p>
        </div>
      </Link>
      <ActionButton
        type="button"
        variant="ghost"
        size="icon-sm"
        className="shrink-0 text-muted-foreground"
        aria-label={`Copy ${title}`}
        action={() => duplicateCvDocument(id)}
      >
        <Copy className="size-4" />
      </ActionButton>
      <ActionButton
        type="button"
        variant="ghost"
        size="icon-sm"
        className="shrink-0 text-muted-foreground hover:text-destructive"
        aria-label={`Delete ${title}`}
        action={() => deleteCvDocument(id)}
      >
        <Trash2 className="size-4" />
      </ActionButton>
    </li>
  );
}
