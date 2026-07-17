export type FeatureFlagUser = {
  email?: string | null;
  role?: string | null;
};

export type FeatureFlagTarget = {
  superAdmins?: boolean;
  users?: string[];
};

export type FeatureFlagValue = boolean | FeatureFlagTarget;

const defaults = {
  enable_postmark: false,
  enable_email_confirmation: false,
  enable_passkey: false,
} satisfies Record<string, FeatureFlagValue>;

export type FeatureFlagKey = keyof typeof defaults;

export type FeatureFlagObject = Record<FeatureFlagKey, FeatureFlagValue>;

export const defaultFeatureFlags = defaults as FeatureFlagObject;

export type AppConfig = {
  features: FeatureFlagObject;
};

function isEnvTrue(name: string): boolean {
  return process.env[name] === "true";
}

export function getAppConfig(): AppConfig {
  return {
    features: {
      enable_postmark: isEnvTrue("ENABLE_POSTMARK"),
      enable_email_confirmation: isEnvTrue("ENABLE_EMAIL_CONFIRMATION"),
      // NEXT_PUBLIC_ so the login client UI can read it.
      enable_passkey:
        isEnvTrue("ENABLE_PASSKEY") ||
        isEnvTrue("NEXT_PUBLIC_ENABLE_PASSKEY"),
    },
  };
}

export function getLocalStorageItem<T>(key: string): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) {
      return null;
    }
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function isSuperAdmin(user: FeatureFlagUser | null): boolean {
  if (user?.role === "admin") {
    return true;
  }

  const email = user?.email ?? "";
  if (!email) {
    return false;
  }

  const superAdminEmails =
    process.env.SUPER_ADMIN_EMAILS?.split(",")
      .map((value) => value.trim())
      .filter(Boolean) ?? [];

  return superAdminEmails.includes(email);
}

function resolveFeatureUser(
  user?: FeatureFlagUser | null,
): FeatureFlagUser | null {
  if (user !== undefined) {
    return user;
  }

  return getLocalStorageItem<FeatureFlagUser>("user");
}

export function isFeatureEnabled(
  name: FeatureFlagKey,
  user?: FeatureFlagUser | null,
): boolean {
  const resolvedUser = resolveFeatureUser(user);
  const appConfig = getAppConfig();
  const featureValue = appConfig.features[name] ?? defaultFeatureFlags[name];

  if (typeof featureValue === "boolean") {
    return featureValue;
  }

  if (typeof featureValue !== "object" || featureValue == null) {
    return false;
  }

  if (featureValue.superAdmins && isSuperAdmin(resolvedUser)) {
    return true;
  }

  if (featureValue.users?.length) {
    return featureValue.users.includes(resolvedUser?.email ?? "");
  }

  return false;
}
