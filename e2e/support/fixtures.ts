import { test as base, createBdd } from "playwright-bdd";
import {
  type AuthCookie,
  buildUserInput,
  signInViaApi,
  signUpViaApi,
  type TestUserInput,
} from "./auth";
import { createTestUser } from "./factories/user.factory";

type Fixtures = {
  testUser: TestUserInput & { cookies: AuthCookie[] };
  asMember: void;
  asAdmin: void;
};

export const test = base.extend<Fixtures>({
  testUser: async ({}, use) => {
    const created = await createTestUser({ role: "user" });
    await use({ ...created.user, cookies: created.cookies });
  },

  asMember: async ({ context }, use) => {
    const created = await createTestUser({
      name: "Member User",
      role: "user",
    });
    await context.addCookies(created.cookies);
    await use();
  },

  asAdmin: async ({ context }, use) => {
    const created = await createTestUser({
      name: "Admin User",
      role: "admin",
    });
    await context.addCookies(created.cookies);
    await use();
  },
});

export const { Given, When, Then, Before } = createBdd(test);

export { buildUserInput, signInViaApi, signUpViaApi };
