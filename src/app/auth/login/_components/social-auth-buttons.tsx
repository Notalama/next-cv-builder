"use client";

import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button";
import { CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth/auth-client";
import {
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
  SUPPORTED_OAUTH_PROVIDERS,
} from "@/lib/auth/o-auth-providers";
import { isFeatureEnabled } from "@/lib/features/flags";

export function SocialAuthButtons() {
  if (!isFeatureEnabled("social_auth")) {
    return null;
  }

  return SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
    const Icon = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].Icon;

    return (
      <BetterAuthActionButton
        variant="outline"
        key={provider}
        action={() => {
          return authClient.signIn.social({
            provider,
            callbackURL: "/dashboard",
          });
        }}
      >
        <Icon />
        {SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name}
      </BetterAuthActionButton>
    );
  });
}

export function SocialAuthFooter() {
  if (!isFeatureEnabled("social_auth")) {
    return null;
  }

  return (
    <>
      <Separator />
      <CardFooter className="grid grid-cols-2 gap-3">
        <SocialAuthButtons />
      </CardFooter>
    </>
  );
}
