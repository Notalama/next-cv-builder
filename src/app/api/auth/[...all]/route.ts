import { findIp } from "@arcjet/ip";
import arcjet, {
  type BotOptions,
  detectBot,
  type EmailOptions,
  protectSignup,
  type SlidingWindowRateLimitOptions,
  shield,
  slidingWindow,
} from "@arcjet/next";
import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/auth/auth";
import { isFeatureEnabled } from "@/lib/features/flags";

const arcjetKey = process.env.ARCJET_API_KEY;

const aj = arcjetKey
  ? arcjet({
      key: arcjetKey,
      characteristics: ["userIdOrIp"],
      rules: [shield({ mode: "LIVE" })],
    })
  : null;

const botSettings = {
  mode: "LIVE",
  allow: ["STRIPE_WEBHOOK"],
} satisfies BotOptions;
const restrictiveRateLimitSettings = {
  mode: "LIVE",
  max: 10,
  interval: "10m",
} satisfies SlidingWindowRateLimitOptions<[]>;
const laxRateLimitSettings = {
  mode: "LIVE",
  max: 60,
  interval: "1m",
} satisfies SlidingWindowRateLimitOptions<[]>;
const emailSettings = {
  mode: "LIVE",
  deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
} satisfies EmailOptions;

function databaseDisabledResponse() {
  return Response.json(
    {
      error: {
        message:
          "Database is disabled. Set ENABLE_DATABASE=true to use authentication.",
        code: "DATABASE_DISABLED",
      },
    },
    { status: 503 },
  );
}

function getAuthHandlers() {
  return toNextJsHandler(getAuth());
}

export async function GET(request: Request) {
  if (!isFeatureEnabled("enable_database")) {
    return databaseDisabledResponse();
  }

  return getAuthHandlers().GET(request);
}

export async function POST(request: Request) {
  if (!isFeatureEnabled("enable_database")) {
    return databaseDisabledResponse();
  }

  const clonedRequest = request.clone();

  if (aj) {
    const decision = await checkArcjet(request);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return new Response(null, { status: 429 });
      }
      if (decision.reason.isEmail()) {
        let message: string;

        if (decision.reason.emailTypes.includes("INVALID")) {
          message = "Email address format is invalid.";
        } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
          message = "Disposable email addresses are not allowed.";
        } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
          message = "Email domain is not valid.";
        } else {
          message = "Invalid email.";
        }

        return Response.json({ message }, { status: 400 });
      }

      return new Response(null, { status: 403 });
    }
  }

  return getAuthHandlers().POST(clonedRequest);
}

async function checkArcjet(request: Request) {
  if (!aj) {
    throw new Error("Arcjet client is not configured");
  }

  const body = (await request.json()) as unknown;
  const session = await getAuth().api.getSession({ headers: request.headers });
  const userIdOrIp = (session?.user.id ?? findIp(request)) || "127.0.0.1";

  if (request.url.endsWith("/auth/sign-up")) {
    if (
      body &&
      typeof body === "object" &&
      "email" in body &&
      typeof body.email === "string"
    ) {
      return aj
        .withRule(
          protectSignup({
            email: emailSettings,
            bots: botSettings,
            rateLimit: restrictiveRateLimitSettings,
          }),
        )
        .protect(request, { email: body.email, userIdOrIp });
    }

    return aj
      .withRule(detectBot(botSettings))
      .withRule(slidingWindow(restrictiveRateLimitSettings))
      .protect(request, { userIdOrIp });
  }

  return aj
    .withRule(detectBot(botSettings))
    .withRule(slidingWindow(laxRateLimitSettings))
    .protect(request, { userIdOrIp });
}
