"use client";

import { useRef, useState, type FormEvent } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const changeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match",
  });

type FieldErrors = Partial<
  Record<"currentPassword" | "newPassword" | "confirmNewPassword" | "form", string>
>;

interface ChangePasswordFormProps {
  onSuccess?: () => void;
}

export function ChangePasswordForm({ onSuccess }: ChangePasswordFormProps = {}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setSuccess(false);

    const formData = new FormData(event.currentTarget);
    const parsed = changeSchema.safeParse({
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
      confirmNewPassword: formData.get("confirmNewPassword"),
    });

    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof FieldErrors | undefined;
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setIsPending(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = (await res.json().catch(() => null)) as
        | {
            success?: boolean;
            error?: string;
            issues?: Record<string, string[]>;
          }
        | null;

      if (!res.ok || !body?.success) {
        if (body?.issues) {
          const fieldErrors: FieldErrors = {};
          for (const [key, messages] of Object.entries(body.issues)) {
            if (messages?.[0])
              fieldErrors[key as keyof FieldErrors] = messages[0];
          }
          setErrors(fieldErrors);
        } else {
          setErrors({ form: body?.error ?? "Failed to change password." });
        }
        return;
      }

      formRef.current?.reset();
      setSuccess(true);
      onSuccess?.();
    } catch {
      setErrors({ form: "Network error. Please try again." });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={handleSubmit}
      className="space-y-3"
    >
      <div className="space-y-1.5">
        <label htmlFor="currentPassword" className="text-sm font-medium">
          Current password
        </label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
        />
        {errors.currentPassword ? (
          <p className="text-xs text-destructive">{errors.currentPassword}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="newPassword" className="text-sm font-medium">
          New password
        </label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
        />
        {errors.newPassword ? (
          <p className="text-xs text-destructive">{errors.newPassword}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="confirmNewPassword" className="text-sm font-medium">
          Confirm new password
        </label>
        <Input
          id="confirmNewPassword"
          name="confirmNewPassword"
          type="password"
          autoComplete="new-password"
          required
        />
        {errors.confirmNewPassword ? (
          <p className="text-xs text-destructive">{errors.confirmNewPassword}</p>
        ) : null}
      </div>

      {errors.form ? (
        <p
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {errors.form}
        </p>
      ) : null}

      {success ? (
        <p
          role="status"
          className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400"
        >
          Password updated.
        </p>
      ) : null}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}
