import { BrandLink } from "@/components/brand-link";
import { ButtonLink } from "@/components/ui/button";

export function LandingHeader({ hasSession }: { hasSession: boolean }) {
  return (
    <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <BrandLink />

        <nav className="flex items-center gap-2">
          {hasSession ? (
            <ButtonLink href="/dashboard" size="lg">
              Dashboard
            </ButtonLink>
          ) : (
            <>
              <ButtonLink href="/auth/login" variant="ghost" size="lg">
                Sign in
              </ButtonLink>
              <ButtonLink href="/auth/login?tab=signup" size="lg">
                Sign up
              </ButtonLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
