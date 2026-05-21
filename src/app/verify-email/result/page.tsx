import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { ResendVerificationButton } from "../ResendVerificationButton";

type Status = "success" | "expired" | "invalid";

interface VerifyEmailResultPageProps {
  searchParams: Promise<{ status?: string }>;
}

const COPY: Record<Status, { title: string; body: string }> = {
  success: {
    title: "Email verified",
    body: "Your email is confirmed. You can sign in to your account now.",
  },
  expired: {
    title: "Link expired",
    body: "This verification link has expired. Request a fresh one below.",
  },
  invalid: {
    title: "Invalid link",
    body: "This verification link is invalid or has already been used. Request a fresh one below.",
  },
};

export default async function VerifyEmailResultPage({
  searchParams,
}: VerifyEmailResultPageProps) {
  const { status: rawStatus } = await searchParams;
  const status: Status =
    rawStatus === "success" || rawStatus === "expired"
      ? rawStatus
      : "invalid";

  if (status === "success") {
    const session = await auth();
    if (session?.user) {
      redirect("/dashboard");
    }
  }

  const { title, body } = COPY[status];

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6 rounded-lg border border-border bg-card p-6 shadow-sm">
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{body}</p>
        </header>

        {status === "success" ? (
          <Link
            href="/sign-in"
            className="block w-full rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Continue to sign in
          </Link>
        ) : (
          <>
            <ResendVerificationButton />
            <p className="text-center text-sm text-muted-foreground">
              Already verified?{" "}
              <Link
                href="/sign-in"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
