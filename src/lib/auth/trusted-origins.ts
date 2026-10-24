type AuthOriginEnv = {
  BETTER_AUTH_URL?: string;
  BETTER_AUTH_TRUSTED_ORIGINS?: string;
  VERCEL_URL?: string;
  VERCEL_BRANCH_URL?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
};

const LOOPBACK_HOSTS = [
  "localhost:3000",
  "localhost:3001",
  "127.0.0.1:3000",
  "127.0.0.1:3001",
];

const PROJECT_VERCEL_HOSTS = [
  "next-cv-builder.vercel.app",
  "next-cv-builder-borys-koblents-projects.vercel.app",
  "next-cv-builder-*-borys-koblents-projects.vercel.app",
];

function hostFrom(value: string | undefined): string | null {
  if (value == null) {
    return null;
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return null;
  }

  try {
    return new URL(trimmed).host;
  } catch {
    try {
      return new URL(`https://${trimmed}`).host;
    } catch {
      return null;
    }
  }
}

function fallbackUrl(env: AuthOriginEnv): string {
  const configured = env.BETTER_AUTH_URL?.trim();
  if (configured) {
    return configured;
  }

  const productionHost = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (productionHost) {
    return `https://${productionHost}`;
  }

  const deploymentHost = env.VERCEL_URL?.trim();
  if (deploymentHost) {
    return `https://${deploymentHost}`;
  }

  return "http://localhost:3000";
}

export function getAuthBaseURLConfig(
  env: AuthOriginEnv = {
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    BETTER_AUTH_TRUSTED_ORIGINS: process.env.BETTER_AUTH_TRUSTED_ORIGINS,
    VERCEL_URL: process.env.VERCEL_URL,
    VERCEL_BRANCH_URL: process.env.VERCEL_BRANCH_URL,
    VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  },
): {
  allowedHosts: string[];
  fallback: string;
  protocol: "auto";
} {
  const allowedHosts = new Set<string>([
    ...LOOPBACK_HOSTS,
    ...PROJECT_VERCEL_HOSTS,
  ]);

  for (const value of [
    env.BETTER_AUTH_URL,
    env.VERCEL_URL,
    env.VERCEL_BRANCH_URL,
    env.VERCEL_PROJECT_PRODUCTION_URL,
  ]) {
    const host = hostFrom(value);
    if (host) {
      allowedHosts.add(host);
    }
  }

  const extraOrigins = env.BETTER_AUTH_TRUSTED_ORIGINS;
  if (extraOrigins) {
    for (const part of extraOrigins.split(",")) {
      const host = hostFrom(part);
      if (host) {
        allowedHosts.add(host);
      }
    }
  }

  return {
    allowedHosts: [...allowedHosts],
    fallback: fallbackUrl(env),
    protocol: "auto",
  };
}
