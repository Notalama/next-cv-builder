"use client";

import { ActionButton } from "@/components/ui/action-button";
import type { BetterAuthActionButtonProps } from "@/models/ui";

export function BetterAuthActionButton({
  action,
  successMessage,
  ...props
}: BetterAuthActionButtonProps) {
  return (
    <ActionButton
      {...props}
      action={async () => {
        const res = await action();

        if (res.error) {
          return { error: true, message: res.error.message || "Action failed" };
        } else {
          return { error: false, message: successMessage };
        }
      }}
    />
  );
}
