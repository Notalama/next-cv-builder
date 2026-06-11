import type { LucideIcon } from "lucide-react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export type FormSectionHeaderProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function FormSectionHeader({
  icon: Icon,
  title,
  description,
}: FormSectionHeaderProps) {
  return (
    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
      <div className="p-2 bg-primary/10 rounded-lg text-primary">
        <Icon size={20} />
      </div>
      <div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
    </CardHeader>
  );
}
