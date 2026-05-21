import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { findPasswordResetToken } from "@/lib/password-reset";
import { prisma } from "@/lib/prisma";
import { VerificationTokenPurpose } from "@/lib/verification-tokens";

const BCRYPT_ROUNDS = 12;

const resetSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

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

  const parsed = resetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Validation failed",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { token, password } = parsed.data;

  try {
    const found = await findPasswordResetToken(token);
    if (!found.ok) {
      return NextResponse.json(
        {
          success: false,
          error:
            found.reason === "expired"
              ? "This reset link has expired. Request a new one."
              : "This reset link is invalid. Request a new one.",
          code: found.reason,
        },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Atomic: set the new password, mark the email verified if (and only if)
    // it wasn't already — successfully receiving the reset email proves inbox
    // ownership, but we don't want to overwrite an earlier verification
    // timestamp. Delete every outstanding reset token for this user so no
    // stale links remain usable.
    const now = new Date();
    await prisma.$transaction([
      prisma.user.update({
        where: { id: found.userId },
        data: { password: passwordHash },
      }),
      prisma.user.updateMany({
        where: { id: found.userId, emailVerified: null },
        data: { emailVerified: now },
      }),
      prisma.userVerificationToken.deleteMany({
        where: {
          userId: found.userId,
          purpose: VerificationTokenPurpose.PASSWORD_RESET,
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[auth/reset-password] unexpected error", error);
    return NextResponse.json(
      { success: false, error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
