import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { SignInForm } from "./SignInForm";

interface SignInPageProps {
  searchParams: Promise<{
    callbackUrl?: string;
    error?: string;
    code?: string;
    reset?: string;
    deleted?: string;
  }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  const { callbackUrl, error, code, reset, deleted } = await searchParams;
  const justReset = reset === "1";
  const justDeleted = deleted === "1";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6 rounded-lg border border-border bg-card p-6 shadow-sm">
        <header className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back to DevStash
          </p>
        </header>

        {justDeleted ? (
          <p
            role="status"
            className="rounded-md border border-border bg-muted/40 px-3 py-2 text-center text-sm text-muted-foreground"
          >
            Your account was deleted. Thanks for trying DevStash.
          </p>
        ) : null}

        {justReset ? (
          <p
            role="status"
            className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-center text-sm text-emerald-600 dark:text-emerald-400"
          >
            Your password was reset — sign in below.
          </p>
        ) : null}

        <SignInForm
          callbackUrl={callbackUrl}
          initialError={error}
          initialCode={code}
        />

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
