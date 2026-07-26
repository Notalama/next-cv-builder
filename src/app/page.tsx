import { LandingHeader } from "@/app/_components/landing/landing-header";
import { LandingHero } from "@/app/_components/landing/landing-hero";
import { TemplateShowcase } from "@/app/_components/landing/template-showcase";
import { TryNowCta } from "@/app/_components/landing/try-now-cta";
import { getServerSession } from "@/lib/auth/session";

export default async function Home() {
  const session = await getServerSession();
  const hasSession = session != null;

  return (
    <>
      <LandingHeader hasSession={hasSession} />
      <main className="flex flex-1 flex-col">
        <LandingHero />
        <TemplateShowcase />
        <TryNowCta hasSession={hasSession} />
      </main>
    </>
  );
}
