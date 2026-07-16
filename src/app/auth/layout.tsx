import { AuthDisabledNotice } from "@/components/auth/auth-disabled-notice";
import { isFeatureEnabled } from "@/lib/features/flags";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isFeatureEnabled("enable_database")) {
    return <AuthDisabledNotice />;
  }

  return children;
}
