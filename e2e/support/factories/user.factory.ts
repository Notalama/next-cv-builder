import {
  buildUserInput,
  signUpViaApi,
  type TestUserInput,
} from "../auth";

export async function createTestUser(overrides: Partial<TestUserInput> = {}) {
  const input = buildUserInput(overrides);
  const cookies = await signUpViaApi(input);
  return { user: input, cookies };
}
