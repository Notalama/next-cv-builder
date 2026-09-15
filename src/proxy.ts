import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled } from "@/lib/features/flags";

const PROTECTED_PATHS = ["/dashboard", "/cv-builder"];

function isProtectedPath(pathname: string) {
  if (
    isFeatureEnabled("sprite_generator") &&
    (pathname === "/sprite-generator" ||
      pathname.startsWith("/sprite-generator/"))
  ) {
    return true;
  }

  return PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);
  const hasSession = sessionCookie != null;

  if (!hasSession && isProtectedPath(pathname)) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && pathname === "/auth/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
