import { cn } from "@/lib/utils";

export type BadgeListProps = {
  items: string[];
  badgeClassName?: string;
};

export function BadgeList({ items, badgeClassName }: BadgeListProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          className={cn(
            "px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 rounded",
            badgeClassName,
          )}
          key={item}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
