import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { RemoteModule } from "@/components/remote-module";
import { ButtonLink } from "@/components/ui/button";
import { requireSession } from "@/lib/auth/session";
import { isFeatureEnabled } from "@/lib/features/flags";

export default async function SpriteGeneratorPage() {
  if (!isFeatureEnabled("sprite_generator")) {
    notFound();
  }

  await requireSession();

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-10">
      <header className="space-y-4">
        <ButtonLink
          href="/dashboard"
          variant="ghost"
          className="w-fit gap-2 text-muted-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </ButtonLink>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Sprite Sheet Generator
          </h1>
          <p className="text-sm text-muted-foreground">
            Extract MP4 frames as a ZIP of PNGs, or upload PNG frames and pack
            them into one transparent sheet for Unity 2D.
          </p>
        </div>
      </header>
      <RemoteModule
        remote="sprite_generator/SpriteGenerator"
        name="Sprite Sheet Generator"
      />
    </div>
  );
}
