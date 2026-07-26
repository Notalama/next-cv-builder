import { FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandLink({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex w-fit items-center gap-2 text-sm font-semibold tracking-tight transition-colors hover:text-primary",
        className,
      )}
    >
      <FileText className="size-4 text-primary" />
      CV Builder
    </Link>
  );
}
