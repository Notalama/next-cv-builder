"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth/auth-client";
import type { AuthTab } from "@/models/auth";
import { EmailVerification } from "./_components/email-verification";
import { ForgotPassword } from "./_components/forgot-password";
import { SignInTab } from "./_components/sign-in-tab";
import { SignUpTab } from "./_components/sign-up-tab";
import { SocialAuthButtons } from "./_components/social-auth-buttons";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [selectedTab, setSelectedTab] = useState<AuthTab>("signin");

  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data != null) router.push("/dashboard");
    });
  }, [router]);

  function openEmailVerificationTab(verificationEmail: string) {
    setEmail(verificationEmail);
    setSelectedTab("email-verification");
  }

  return (
    <div className="flex min-h-dvh w-full items-center justify-center px-4 py-8">
      <Tabs
        value={selectedTab}
        onValueChange={(tab) => setSelectedTab(tab as AuthTab)}
        className="w-full max-w-md"
      >
        {(selectedTab === "signin" || selectedTab === "signup") && (
          <TabsList className="w-full">
            <TabsTrigger value="signin" className="flex-1">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="flex-1">
              Sign Up
            </TabsTrigger>
          </TabsList>
        )}
        <TabsContent value="signin">
          <Card>
            <CardHeader className="text-2xl font-bold">
              <CardTitle>Sign In</CardTitle>
            </CardHeader>
            <CardContent>
              <SignInTab
                openEmailVerificationTab={openEmailVerificationTab}
                openForgotPassword={() => setSelectedTab("forgot-password")}
              />
            </CardContent>

            <Separator />

            <CardFooter className="grid grid-cols-2 gap-3">
              <SocialAuthButtons />
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="signup">
          <Card>
            <CardHeader className="text-2xl font-bold">
              <CardTitle>Sign Up</CardTitle>
            </CardHeader>
            <CardContent>
              <SignUpTab openEmailVerificationTab={openEmailVerificationTab} />
            </CardContent>

            <Separator />

            <CardFooter className="grid grid-cols-2 gap-3">
              <SocialAuthButtons />
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="email-verification">
          <Card>
            <CardHeader className="text-2xl font-bold">
              <CardTitle>Verify Your Email</CardTitle>
            </CardHeader>
            <CardContent>
              <EmailVerification email={email} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forgot-password">
          <Card>
            <CardHeader className="text-2xl font-bold">
              <CardTitle>Forgot Password</CardTitle>
            </CardHeader>
            <CardContent>
              <ForgotPassword openSignInTab={() => setSelectedTab("signin")} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
