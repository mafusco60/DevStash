import { NextResponse } from "next/server";
import { z } from "zod";

import {
  issuePasswordResetToken,
  sendPasswordResetEmail,
} from "@/lib/password-reset";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.email().trim().toLowerCase(),
});

// Always responds 200 with { success: true } so callers can't enumerate which
// emails are registered or whether an account is OAuth-only. Only actually
// issues a token + sends an email when the user exists AND has a password set
// (skipping OAuth-only accounts, since they can't sign in with a password).
// Errors during the send are logged server-side but never change the response.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Enter a valid email address" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true, email: true, name: true, password: true },
    });

    if (user && user.password) {
      const token = await issuePasswordResetToken(user.id);
      await sendPasswordResetEmail({ to: user.email, name: user.name, token });
    }
  } catch (error) {
    console.error("[auth/forgot-password] unexpected error", error);
  }

  return NextResponse.json({ success: true });
}
