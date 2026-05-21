import Link from "next/link";

import { findPasswordResetToken } from "@/lib/password-reset";

import { ResetPasswordForm } from "./ResetPasswordForm";

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;

  const lookup = token
    ? await findPasswordResetToken(token)
    : ({ ok: false, reason: "invalid" } as const);

  if (!lookup.ok) {
    const heading =
      lookup.reason === "expired"
        ? "Reset link expired"
        : "Reset link invalid";
    const detail =
      lookup.reason === "expired"
        ? "This password reset link has expired. Request a fresh one to continue."
        : "This password reset link is invalid or has already been used. Request a fresh one to continue.";

    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm space-y-6 rounded-lg border border-border bg-card p-6 shadow-sm">
          <header className="space-y-1 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">{heading}</h1>
            <p className="text-sm text-muted-foreground">{detail}</p>
          </header>

          <Link
            href="/forgot-password"
            className="block w-full rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Request a new link
          </Link>

          <p className="text-center text-sm text-muted-foreground">
            <Link
              href="/sign-in"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Back to sign in
            </Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6 rounded-lg border border-border bg-card p-6 shadow-sm">
        <header className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Choose a new password
          </h1>
          <p className="text-sm text-muted-foreground">
            Pick something at least 8 characters long.
          </p>
        </header>

        <ResetPasswordForm token={token!} />
      </div>
    </main>
  );
}
