import { NextResponse } from "next/server";
import { z } from "zod";

import {
  issueVerificationToken,
  sendVerificationEmail,
} from "@/lib/email-verification";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.email().trim().toLowerCase(),
});

// Always responds 200 with { success: true } so callers can't enumerate
// which emails are registered. Errors are logged server-side.
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
      select: { id: true, email: true, name: true, emailVerified: true },
    });

    if (user && !user.emailVerified) {
      const token = await issueVerificationToken(user.id);
      await sendVerificationEmail({ to: user.email, name: user.name, token });
    }
  } catch (error) {
    console.error("[auth/resend-verification] unexpected error", error);
  }

  return NextResponse.json({ success: true });
}
