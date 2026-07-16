import { passkey } from "@better-auth/passkey";
import { stripe } from "@better-auth/stripe";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin } from "better-auth/plugins/admin";
import { organization } from "better-auth/plugins/organization";
import { twoFactor } from "better-auth/plugins/two-factor";
import { and, desc, eq } from "drizzle-orm";
import Stripe from "stripe";
import { ac, admin, user } from "@/components/auth/permissions";
import { getDb } from "@/drizzle/db";
import { member } from "@/drizzle/schema";
import { isFeatureEnabled } from "@/lib/features/flags";
import { sendDeleteAccountVerificationEmail } from "../emails/delete-account-verification";
import { sendEmailVerificationEmail } from "../emails/email-verification";
import { sendOrganizationInviteEmail } from "../emails/organization-invite-email";
import { sendPasswordResetEmail } from "../emails/password-reset-email";
import { sendWelcomeEmail } from "../emails/welcome-email";
import { STRIPE_PLANS } from "./stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeConfigured = stripeSecretKey != null && stripeSecretKey.length > 0;

const stripeClient = new Stripe(stripeSecretKey ?? "sk_test_placeholder", {
  apiVersion: "2025-08-27.basil",
});

let authInstance: ReturnType<typeof createAuthInstance> | null = null;

function getSocialProviders() {
  const providers: Record<string, object> = {};

  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    providers.github = {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      mapProfileToUser: (profile: { public_repos?: number }) => ({
        favoriteNumber: Number(profile.public_repos) || 0,
      }),
    };
  }

  if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET) {
    providers.discord = {
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      mapProfileToUser: () => ({
        favoriteNumber: 0,
      }),
    };
  }

  return providers;
}

function createAuthInstance() {
  const db = getDb();

  return betterAuth({
    appName: "CV Builder",
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: process.env.BETTER_AUTH_URL
      ? [process.env.BETTER_AUTH_URL]
      : undefined,
    user: {
      changeEmail: {
        enabled: true,
        sendChangeEmailConfirmation: async ({ user, url, newEmail }) => {
          await sendEmailVerificationEmail({
            user: { ...user, email: newEmail },
            url,
          });
        },
      },
      deleteUser: {
        enabled: true,
        sendDeleteAccountVerification: async ({ user, url }) => {
          await sendDeleteAccountVerificationEmail({ user, url });
        },
      },
      additionalFields: {
        favoriteNumber: {
          type: "number",
          required: true,
        },
      },
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: isFeatureEnabled("enable_email_confirmation"),
      sendResetPassword: async ({ user, url }) => {
        await sendPasswordResetEmail({ user, url });
      },
    },
    emailVerification: {
      autoSignInAfterVerification: true,
      sendOnSignUp: isFeatureEnabled("enable_email_confirmation"),
      sendVerificationEmail: async ({ user, url }) => {
        await sendEmailVerificationEmail({ user, url });
      },
    },
    socialProviders: getSocialProviders(),
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 60,
      },
    },
    plugins: [
      twoFactor(),
      passkey(),
      adminPlugin({
        ac,
        roles: {
          admin,
          user,
        },
      }),
      organization({
        sendInvitationEmail: async ({
          email,
          organization,
          inviter,
          invitation,
        }) => {
          await sendOrganizationInviteEmail({
            invitation,
            inviter: inviter.user,
            organization,
            email,
          });
        },
      }),
      ...(stripeConfigured && process.env.STRIPE_WEBHOOK_SECRET
        ? [
            stripe({
              stripeClient,
              stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
              createCustomerOnSignUp: true,
              subscription: {
                authorizeReference: async ({ user, referenceId, action }) => {
                  const memberItem = await db.query.member.findFirst({
                    where: and(
                      eq(member.organizationId, referenceId),
                      eq(member.userId, user.id),
                    ),
                  });

                  if (
                    action === "upgrade-subscription" ||
                    action === "cancel-subscription" ||
                    action === "restore-subscription"
                  ) {
                    return memberItem?.role === "owner";
                  }

                  return memberItem != null;
                },
                enabled: true,
                plans: STRIPE_PLANS,
              },
            }),
          ]
        : []),
      nextCookies(),
    ],
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    hooks: {
      after: createAuthMiddleware(async (ctx) => {
        if (ctx.path.startsWith("/sign-up")) {
          const user = ctx.context.newSession?.user ?? {
            name: ctx.body.name,
            email: ctx.body.email,
          };

          if (user != null) {
            await sendWelcomeEmail(user);
          }
        }
      }),
    },
    databaseHooks: {
      session: {
        create: {
          before: async (userSession) => {
            const membership = await db.query.member.findFirst({
              where: eq(member.userId, userSession.userId),
              orderBy: desc(member.createdAt),
              columns: { organizationId: true },
            });

            return {
              data: {
                ...userSession,
                activeOrganizationId: membership?.organizationId,
              },
            };
          },
        },
      },
    },
  });
}

export function getAuth(): ReturnType<typeof createAuthInstance> {
  if (!isFeatureEnabled("enable_database")) {
    throw new Error(
      "Authentication is disabled. Set ENABLE_DATABASE=true to enable it.",
    );
  }

  if (authInstance == null) {
    authInstance = createAuthInstance();
  }

  return authInstance;
}
