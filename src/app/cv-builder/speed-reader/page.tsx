import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { SpeedReader } from "@/app/cv-builder/speed-reader/_components/speed-reader";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Speed Reader",
  description: "Speed-read any text one word at a time.",
};

export default function SpeedReaderPage() {
  return (
    <div className="mx-auto flex h-svh w-full max-w-4xl flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Speed Reader</h1>
        <ButtonLink
          href="/cv-builder"
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <ArrowLeft className="size-4" />
          Back to form
        </ButtonLink>
      </div>
      <SpeedReader />
    </div>
  );
}
