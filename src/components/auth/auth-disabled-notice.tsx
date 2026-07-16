import { ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AuthDisabledNotice() {
  return (
    <div className="my-6 px-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication unavailable</CardTitle>
          <CardDescription>
            Database support is turned off. Set{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              ENABLE_DATABASE=true
            </code>{" "}
            and configure{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              DATABASE_URL
            </code>{" "}
            to enable sign-in and account features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ButtonLink href="/cv-builder" className="w-full">
            Back to CV builder
          </ButtonLink>
        </CardContent>
      </Card>
    </div>
  );
}
