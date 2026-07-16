import type { ComponentProps, ElementType } from "react";
import { z } from "zod";

export const signInSchema = z.object({
  email: z.email().min(1),
  password: z.string().min(6),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  name: z.string().min(1),
  email: z.email().min(1),
  password: z.string().min(6),
  favoriteNumber: z.number().int(),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email().min(1),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  password: z.string().min(6),
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const totpSchema = z.object({
  code: z.string().length(6),
});

export type TotpFormValues = z.infer<typeof totpSchema>;

export const backupCodeSchema = z.object({
  code: z.string().min(1),
});

export type BackupCodeFormValues = z.infer<typeof backupCodeSchema>;

export type AuthTab =
  | "signin"
  | "signup"
  | "email-verification"
  | "forgot-password";

export interface SignInTabProps {
  openEmailVerificationTab: (email: string) => void;
  openForgotPassword: () => void;
}

export interface SignUpTabProps {
  openEmailVerificationTab: (email: string) => void;
}

export interface ForgotPasswordProps {
  openSignInTab: () => void;
}

export interface EmailVerificationProps {
  email: string;
}

export interface OAuthProviderDetails {
  name: string;
  Icon: ElementType<ComponentProps<"svg">>;
}
