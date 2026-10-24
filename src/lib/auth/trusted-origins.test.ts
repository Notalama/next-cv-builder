import { describe, expect, it } from "vitest";
import { getAuthBaseURLConfig } from "@/lib/auth/trusted-origins";

describe("getAuthBaseURLConfig", () => {
  it("trusts the production alias and this project's Vercel deployment hosts", () => {
    const { allowedHosts } = getAuthBaseURLConfig({});

    expect(allowedHosts).toEqual(
      expect.arrayContaining([
        "next-cv-builder.vercel.app",
        "next-cv-builder-borys-koblents-projects.vercel.app",
        "next-cv-builder-*-borys-koblents-projects.vercel.app",
        "localhost:3000",
      ]),
    );
    expect(allowedHosts).not.toContain("*.vercel.app");
  });

  it("trusts the configured public URL and extra origins", () => {
    const { allowedHosts, fallback } = getAuthBaseURLConfig({
      BETTER_AUTH_URL: "https://cv.example.com/",
      BETTER_AUTH_TRUSTED_ORIGINS:
        "https://www.cv.example.com, https://preview.cv.example.com",
      VERCEL_PROJECT_PRODUCTION_URL: "cv.example.com",
      VERCEL_URL: "next-cv-builder-abc-borys-koblents-projects.vercel.app",
    });

    expect(fallback).toBe("https://cv.example.com/");
    expect(allowedHosts).toEqual(
      expect.arrayContaining([
        "cv.example.com",
        "www.cv.example.com",
        "preview.cv.example.com",
        "next-cv-builder-abc-borys-koblents-projects.vercel.app",
      ]),
    );
  });
});
