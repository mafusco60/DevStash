"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

interface ResendVerificationButtonProps {
  email?: string;
  variant?: "default" | "outline" | "link";
  className?: string;
}

type Status = "idle" | "sent" | "error";

export function ResendVerificationButton({
  email,
  variant = "outline",
  className,
}: ResendVerificationButtonProps) {
  const [emailInput, setEmailInput] = useState(email ?? "");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setErrorMessage(null);
    setStatus("idle");

    const trimmed = emailInput.trim();
    if (!trimmed) {
      setStatus("error");
      setErrorMessage("Enter your email address first.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/resend-verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: trimmed }),
        });
        const body = (await res.json().catch(() => null)) as
          | { success?: boolean; error?: string }
          | null;
        if (!res.ok || !body?.success) {
          setStatus("error");
          setErrorMessage(body?.error ?? "Failed to send verification email.");
          return;
        }
        setStatus("sent");
      } catch {
        setStatus("error");
        setErrorMessage("Network error. Please try again.");
      }
    });
  }

  const showEmailInput = !email;

  return (
    <div className={className}>
      <div className="space-y-2">
        {showEmailInput ? (
          <div className="space-y-1.5">
            <label htmlFor="resend-email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="resend-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={emailInput}
              onChange={(event) => setEmailInput(event.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        ) : null}

        <Button
          type="button"
          variant={variant}
          onClick={handleClick}
          disabled={isPending}
          className="w-full"
        >
          {isPending ? "Sending…" : "Resend verification email"}
        </Button>
      </div>

      {status === "sent" ? (
        <p className="mt-2 text-xs text-muted-foreground">
          If an unverified account exists for that email, a new link is on its
          way.
        </p>
      ) : null}
      {status === "error" && errorMessage ? (
        <p className="mt-2 text-xs text-destructive">{errorMessage}</p>
      ) : null}
    </div>
  );
}
