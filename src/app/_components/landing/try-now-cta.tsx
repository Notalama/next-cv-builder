import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export function TryNowCta({ hasSession }: { hasSession: boolean }) {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-4 pt-4 pb-20 text-center">
      <p className="text-sm text-muted-foreground">
        Free to start. Your CV stays yours.
      </p>

      <ButtonLink
        href={hasSession ? "/cv-builder" : "/auth/login?tab=signup"}
        size="lg"
        className="h-11 gap-2 px-6 text-base"
      >
        Try now
        <ArrowRight className="size-4" />
      </ButtonLink>
    </section>
  );
}
