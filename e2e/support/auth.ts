import { eq } from "drizzle-orm";
import { user } from "../../src/drizzle/schema";
import { SEED_USERS, type SeedUserKey } from "../data/seeds/users";
import { getTestDb, truncateAllTables } from "./db";
import { getBaseUrl } from "./env";

export type TestUserInput = {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
};

export type AuthCookie = {
  name: string;
  value: string;
  domain: string;
  path: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: "Strict" | "Lax" | "None";
  expires?: number;
};

function parseSetCookieHeaders(headers: Headers): AuthCookie[] {
  const raw =
    typeof headers.getSetCookie === "function"
      ? headers.getSetCookie()
      : [headers.get("set-cookie")].filter(
          (value): value is string => value != null,
        );

  const baseUrl = new URL(getBaseUrl());
  const cookies: AuthCookie[] = [];

  for (const header of raw) {
    for (const single of splitSetCookieHeader(header)) {
      const parts = single.split(";").map((part) => part.trim());
      const [nameValue, ...attrs] = parts;
      const eqIndex = nameValue.indexOf("=");
      if (eqIndex < 0) continue;

      const name = nameValue.slice(0, eqIndex);
      const value = nameValue.slice(eqIndex + 1);
      const cookie: AuthCookie = {
        name,
        value,
        domain: baseUrl.hostname,
        path: "/",
        httpOnly: false,
        secure: baseUrl.protocol === "https:",
        sameSite: "Lax",
      };

      for (const attr of attrs) {
        const lower = attr.toLowerCase();
        if (lower === "httponly") cookie.httpOnly = true;
        else if (lower === "secure") cookie.secure = true;
        else if (lower.startsWith("path=")) cookie.path = attr.slice(5);
        else if (lower.startsWith("samesite=")) {
          const sameSite = attr.slice(9);
          if (sameSite.toLowerCase() === "strict") cookie.sameSite = "Strict";
          else if (sameSite.toLowerCase() === "none") cookie.sameSite = "None";
          else cookie.sameSite = "Lax";
        } else if (lower.startsWith("expires=")) {
          cookie.expires = Math.floor(new Date(attr.slice(8)).getTime() / 1000);
        } else if (lower.startsWith("max-age=")) {
          const maxAge = Number(attr.slice(8));
          if (!Number.isNaN(maxAge)) {
            cookie.expires = Math.floor(Date.now() / 1000) + maxAge;
          }
        }
      }

      cookies.push(cookie);
    }
  }

  return cookies;
}

function splitSetCookieHeader(header: string): string[] {
  // Fallback when getSetCookie is unavailable and multiple cookies are joined.
  return header.split(/,(?=\s*[^;=]+=[^;]+)/);
}

export async function signUpViaApi(
  input: TestUserInput,
): Promise<AuthCookie[]> {
  const response = await fetchWithRetry(
    `${getBaseUrl()}/api/auth/sign-up/email`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: getBaseUrl(),
      },
      body: JSON.stringify({
        name: input.name,
        email: input.email,
        password: input.password,
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`sign-up failed (${response.status}): ${body}`);
  }

  if (input.role != null && input.role !== "user") {
    await setUserRole(input.email, input.role);
  }

  const cookies = parseSetCookieHeaders(response.headers);
  if (cookies.length > 0) {
    return cookies;
  }

  return signInViaApi(input.email, input.password);
}

export async function signInViaApi(
  email: string,
  password: string,
): Promise<AuthCookie[]> {
  const response = await fetchWithRetry(
    `${getBaseUrl()}/api/auth/sign-in/email`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: getBaseUrl(),
      },
      body: JSON.stringify({ email, password }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`sign-in failed (${response.status}): ${body}`);
  }

  const cookies = parseSetCookieHeaders(response.headers);
  if (cookies.length === 0) {
    throw new Error("sign-in succeeded but no session cookies were returned");
  }

  return cookies;
}

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  attempts = 5,
): Promise<Response> {
  let lastResponse: Response | null = null;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const response = await fetch(url, init);
    lastResponse = response;

    if (response.status !== 429) {
      return response;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
  }

  return lastResponse as Response;
}

export async function setUserRole(email: string, role: "user" | "admin") {
  const db = getTestDb();
  await db.update(user).set({ role }).where(eq(user.email, email));
}

export async function resetDatabase() {
  await truncateAllTables();
}

export function getSeedUser(key: SeedUserKey) {
  return SEED_USERS[key];
}

export function uniqueEmail(prefix = "user") {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `${prefix}+${id}@example.com`;
}

export function buildUserInput(
  overrides: Partial<TestUserInput> = {},
): TestUserInput {
  return {
    name: overrides.name ?? "Test User",
    email: overrides.email ?? uniqueEmail(),
    password: overrides.password ?? "Password123!",
    role: overrides.role,
  };
}
