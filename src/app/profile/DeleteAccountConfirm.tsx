"use client";

import { useState, useTransition, type FormEvent } from "react";

import { signOutAfterDeleteAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DeleteAccountConfirmProps {
  email: string;
  onCancel?: () => void;
}

export function DeleteAccountConfirm({
  email,
  onCancel,
}: DeleteAccountConfirmProps) {
  const [confirmText, setConfirmText] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const normalized = confirmText.trim().toLowerCase();
  const matches = normalized === email.toLowerCase();

  async function handleDelete(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!matches) return;
    setErrorMessage(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/delete-account", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ confirm: confirmText }),
        });
        const body = (await res.json().catch(() => null)) as
          | { success?: boolean; error?: string }
          | null;

        if (!res.ok || !body?.success) {
          setErrorMessage(body?.error ?? "Failed to delete account.");
          return;
        }

        // Clear the JWT cookie and redirect to /sign-in?deleted=1.
        await signOutAfterDeleteAction();
      } catch {
        setErrorMessage("Network error. Please try again.");
      }
    });
  }

  return (
    <form onSubmit={handleDelete} className="space-y-3">
      <div className="space-y-1.5">
        <label htmlFor="confirm" className="text-sm font-medium">
          Type your email (
          <span className="font-mono text-foreground">{email}</span>) to confirm
        </label>
        <Input
          id="confirm"
          name="confirm"
          type="text"
          autoComplete="off"
          value={confirmText}
          onChange={(event) => setConfirmText(event.target.value)}
          placeholder={email}
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

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="destructive"
          disabled={!matches || isPending}
        >
          {isPending ? "Deleting…" : "Delete account permanently"}
        </Button>
      </div>
    </form>
  );
}
