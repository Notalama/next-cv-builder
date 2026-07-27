import type { StripePlan } from "@better-auth/stripe";

const stripeBasicPriceId = process.env.STRIPE_BASIC_PRICE_ID ?? "";
const stripeProPriceId = process.env.STRIPE_PRO_PRICE_ID ?? "";

export const STRIPE_PLANS = [
  {
    name: "basic",
    priceId: stripeBasicPriceId,
    limits: {
      projects: 10,
    },
  },
  {
    name: "pro",
    priceId: stripeProPriceId,
    limits: {
      projects: 50,
    },
  },
] as const satisfies StripePlan[];

export type StripePlanName = (typeof STRIPE_PLANS)[number]["name"];

export const PLAN_TO_PRICE: Record<StripePlanName, number> = {
  basic: 19,
  pro: 49,
};
