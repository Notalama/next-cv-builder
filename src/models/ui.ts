import type { ComponentProps, ReactNode } from "react";
import type { Button } from "@/components/ui/button";
import type { Input } from "@/components/ui/input";

export interface ActionResult {
  error: boolean;
  message?: string;
}

export type ActionButtonProps = ComponentProps<typeof Button> & {
  action: () => Promise<ActionResult>;
  requireAreYouSure?: boolean;
  areYouSureDescription?: ReactNode;
};

/** Minimal shape of a better-auth client response used by action buttons. */
export interface BetterAuthActionResponse {
  error: null | { message?: string };
}

export type BetterAuthActionButtonProps = Omit<ActionButtonProps, "action"> & {
  action: () => Promise<BetterAuthActionResponse>;
  successMessage?: string;
};

export type NumberInputProps = Omit<
  ComponentProps<typeof Input>,
  "type" | "onChange" | "value"
> & {
  onChange: (value: number | null) => void;
  value: undefined | null | number;
};

export type PasswordInputProps = Omit<ComponentProps<typeof Input>, "type">;

export interface LoadingSwapProps {
  isLoading: boolean;
  children: ReactNode;
  className?: string;
}
