"use client";

import Link from "next/link";
import { useActionState } from "react";

import { authenticate, signInWithGithub } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ResendVerificationButton } from "../verify-email/ResendVerificationButton";

interface SignInFormProps {
  callbackUrl?: string;
  initialError?: string;
  initialCode?: string;
}

export function SignInForm({
  callbackUrl,
  initialError,
  initialCode,
}: SignInFormProps) {
  const [state, formAction, isPending] = useActionState(authenticate, undefined);

  const emailNotVerified =
    state?.code === "EmailNotVerified" || initialCode === "EmailNotVerified";

  const errorMessage = emailNotVerified
    ? "Please verify your email before signing in."
    : (state?.error ??
      (initialError === "CredentialsSignin"
        ? "Invalid email or password."
        : initialError
          ? "Something went wrong. Please try again."
          : undefined));

  return (
    <div className="space-y-4">
      <form action={signInWithGithub}>
        {callbackUrl ? (
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
        ) : null}
        <Button type="submit" variant="outline" className="w-full">
          Sign in with GitHub
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            or continue with email
          </span>
        </div>
      </div>

      <form action={formAction} className="space-y-3">
        {callbackUrl ? (
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
        ) : null}

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>

        {errorMessage ? (
          <p
            role="alert"
            className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {errorMessage}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      {emailNotVerified ? (
        <ResendVerificationButton email={state?.email} />
      ) : null}
    </div>
  );
}
