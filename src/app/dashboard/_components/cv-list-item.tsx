"use client";

import { Copy, FileText, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteCvDocument, duplicateCvDocument, renameCvDocument } from "@/app/dashboard/actions";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ActionButton } from "@/components/ui/action-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { renameCvSchema } from "@/models/cv-document";

interface CvListItemProps {
  id: string;
  title: string;
  updatedLabel: string;
}

export function CvListItem({ id, title, updatedLabel }: CvListItemProps) {
  const [open, setOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const [isPending, startTransition] = useTransition();

  const openRename = () => {
    setDraftTitle(title);
    setOpen(true);
  };

  const saveRename = () => {
    const parsed = renameCvSchema.safeParse({ id, title: draftTitle });
    if (!parsed.success) {
      toast.error("Failed to rename CV");
      return;
    }

    startTransition(async () => {
      const result = await renameCvDocument(parsed.data.id, parsed.data.title);
      if (result.error) {
        toast.error(result.message ?? "Failed to rename CV");
        return;
      }

      toast.success(result.message ?? "CV renamed");
      setOpen(false);
    });
  };

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
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="shrink-0 text-muted-foreground"
        aria-label={`Rename ${title}`}
        onClick={openRename}
      >
        <Pencil className="size-4" />
      </Button>
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

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (isPending) {
            return;
          }
          setOpen(nextOpen);
          if (nextOpen) {
            setDraftTitle(title);
          }
        }}
      >
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename CV</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor={`rename-cv-${id}`}>CV name</Label>
            <Input
              id={`rename-cv-${id}`}
              aria-label="CV name"
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              maxLength={120}
              disabled={isPending}
              autoFocus
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  saveRename();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" disabled={isPending} onClick={saveRename}>
              <LoadingSwap isLoading={isPending}>Save</LoadingSwap>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </li>
  );
}
