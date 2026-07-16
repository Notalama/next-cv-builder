import { cn } from "@/lib/utils";
import type { PreviewSectionHeadingProps } from "@/models/cv-builder";

export function PreviewSectionHeading({
  title,
  variant,
  className,
}: PreviewSectionHeadingProps) {
  if (variant === "sidebar") {
    return (
      <div className={cn("border-l-2 border-slate-500 pl-2 mb-2", className)}>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          {title}
        </h2>
      </div>
    );
  }

  return (
    <div className={cn("border-b-2 border-slate-200 pb-1 mb-2", className)}>
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
        {title}
      </h2>
    </div>
  );
}
