import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { ResendVerificationButton } from "./ResendVerificationButton";

interface VerifyEmailPageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  const { email } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6 rounded-lg border border-border bg-card p-6 shadow-sm">
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Check your email
          </h1>
          <p className="text-sm text-muted-foreground">
            {email ? (
              <>
                We sent a verification link to{" "}
                <span className="font-medium text-foreground">{email}</span>.
              </>
            ) : (
              <>We sent you a verification link.</>
            )}{" "}
            Click it to activate your account. The link expires in 24 hours.
          </p>
        </header>

        <ResendVerificationButton email={email} />

        <p className="text-center text-sm text-muted-foreground">
          Already verified?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
