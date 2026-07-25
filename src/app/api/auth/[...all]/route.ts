import { findIp } from "@arcjet/ip";
import arcjet, {
  type ArcjetDecision,
  type ArcjetEmailType,
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

const emailDenialMessages: Partial<Record<ArcjetEmailType, string>> = {
  INVALID: "Email address format is invalid.",
  DISPOSABLE: "Disposable email addresses are not allowed.",
  NO_MX_RECORDS: "Email domain is not valid.",
};

function getAuthHandlers() {
  return toNextJsHandler(getAuth());
}

function toDenialResponse(decision: ArcjetDecision): Response | null {
  if (!decision.isDenied()) {
    return null;
  }

  const { reason } = decision;

  if (reason.isRateLimit()) {
    return new Response(null, { status: 429 });
  }

  if (reason.isEmail()) {
    const message =
      reason.emailTypes
        .map((type) => emailDenialMessages[type])
        .find((value) => value != null) ?? "Invalid email.";

    return Response.json({ message }, { status: 400 });
  }

  return new Response(null, { status: 403 });
}

export async function GET(request: Request) {
  return getAuthHandlers().GET(request);
}

export async function POST(request: Request) {
  if (!aj) {
    return getAuthHandlers().POST(request);
  }
  const clonedRequest = request.clone();
  const decision = await checkArcjet(request);
  const denialResponse = toDenialResponse(decision);
  if (denialResponse != null) {
    return denialResponse;
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
