export const SEED_USERS = {
  member: {
    name: "Member User",
    email: "member@example.com",
    password: "Password123!",
    role: "user" as const,
  },
  admin: {
    name: "Admin User",
    email: "admin@example.com",
    password: "Password123!",
    role: "admin" as const,
  },
} as const;

export type SeedUserKey = keyof typeof SEED_USERS;
