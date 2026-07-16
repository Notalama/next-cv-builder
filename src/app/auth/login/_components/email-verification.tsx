"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button";
import { authClient } from "@/lib/auth/auth-client";
import type { EmailVerificationProps } from "@/models/auth";

export function EmailVerification({ email }: EmailVerificationProps) {
  const [timeToNextResend, setTimeToNextResend] = useState(30);
  const interval = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined,
  );

  const startEmailVerificationCountdown = useCallback((time = 30) => {
    setTimeToNextResend(time);

    clearInterval(interval.current);
    interval.current = setInterval(() => {
      setTimeToNextResend((t) => {
        const newT = t - 1;

        if (newT <= 0) {
          clearInterval(interval.current);
          return 0;
        }
        return newT;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startEmailVerificationCountdown();

    return () => clearInterval(interval.current);
  }, [startEmailVerificationCountdown]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mt-2">
        We sent you a verification link. Please check your email and click the
        link to verify your account.
      </p>

      <BetterAuthActionButton
        variant="outline"
        className="w-full"
        successMessage="Verification email sent!"
        disabled={timeToNextResend > 0}
        action={() => {
          startEmailVerificationCountdown();
          return authClient.sendVerificationEmail({
            email,
            callbackURL: "/dashboard",
          });
        }}
      >
        {timeToNextResend > 0
          ? `Resend Email (${timeToNextResend})`
          : "Resend Email"}
      </BetterAuthActionButton>
    </div>
  );
}
