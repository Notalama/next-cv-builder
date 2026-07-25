import { LogOut, Plus } from "lucide-react";
import { CvListItem } from "@/app/dashboard/_components/cv-list-item";
import { listUserCvs, signOut } from "@/app/dashboard/actions";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireSession } from "@/lib/auth/session";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function DashboardPage() {
  const session = await requireSession();
  const cvs = await listUserCvs();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {session.user.name || session.user.email}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ButtonLink href="/cv-builder" className="gap-2">
            <Plus className="size-4" />
            New CV
          </ButtonLink>
          <form action={signOut}>
            <Button type="submit" variant="outline" className="gap-2">
              <LogOut className="size-4" />
              Log out
            </Button>
          </form>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">Saved CVs</h2>

        {cvs.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">No CVs yet</CardTitle>
              <CardDescription>
                Create your first CV to start editing with the live preview
                builder.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ButtonLink href="/cv-builder" className="gap-2">
                <Plus className="size-4" />
                Create CV
              </ButtonLink>
            </CardContent>
          </Card>
        ) : (
          <ul className="divide-y rounded-xl border bg-background">
            {cvs.map((cv) => (
              <CvListItem
                key={cv.id}
                id={cv.id}
                title={cv.title}
                updatedLabel={`Updated ${formatDate(cv.updatedAt)}`}
              />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
