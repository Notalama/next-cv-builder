export function LandingHero() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 px-4 pt-16 pb-12 text-center sm:pt-24">
      <span className="rounded-full border border-border/70 px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground">
        Live preview · Print-ready PDF
      </span>

      <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
        Build a CV recruiters actually read
      </h1>

      <p className="max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
        Fill one structured form and watch it render live into a polished
        document. Switch templates whenever you like, then export a print-ready
        PDF.
      </p>
    </section>
  );
}
