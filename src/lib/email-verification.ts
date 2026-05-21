import { createHash, randomBytes } from "node:crypto";

import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function hashVerificationToken(rawToken: string) {
  return createHash("sha256").update(rawToken).digest("hex");
}

function generateVerificationToken() {
  const token = randomBytes(32).toString("base64url");
  return {
    token,
    tokenHash: hashVerificationToken(token),
    expiresAt: new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS),
  };
}

function buildVerificationUrl(token: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const url = new URL("/api/auth/verify-email", base);
  url.searchParams.set("token", token);
  return url.toString();
}

// Replace any outstanding tokens with a fresh one so a single user can't
// accumulate live tokens. Returns the raw token (only ever held in memory).
export async function issueVerificationToken(userId: string) {
  const { token, tokenHash, expiresAt } = generateVerificationToken();
  await prisma.$transaction([
    prisma.emailVerificationToken.deleteMany({ where: { userId } }),
    prisma.emailVerificationToken.create({
      data: { userId, tokenHash, expiresAt },
    }),
  ]);
  return token;
}

export async function sendVerificationEmail({
  to,
  name,
  token,
}: {
  to: string;
  name: string | null;
  token: string;
}) {
  const verifyUrl = buildVerificationUrl(token);
  const greeting = name ? `Hi ${name},` : "Hi,";

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#0a0a0a;color:#e5e5e5;font-family:ui-sans-serif,system-ui,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#171717;border:1px solid #262626;border-radius:8px;padding:24px;line-height:1.6;">
      <h1 style="margin:0 0 16px;font-size:20px;color:#fafafa;">Confirm your email</h1>
      <p style="margin:0 0 12px;">${greeting}</p>
      <p style="margin:0 0 16px;">Click the button below to verify your email address for DevStash. This link expires in 24 hours.</p>
      <p style="margin:0 0 24px;">
        <a href="${verifyUrl}" style="display:inline-block;background:#fafafa;color:#0a0a0a;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:600;">Verify my email</a>
      </p>
      <p style="margin:0 0 12px;font-size:13px;color:#a3a3a3;">Or paste this URL into your browser:<br><span style="word-break:break-all;color:#d4d4d4;">${verifyUrl}</span></p>
      <p style="margin:24px 0 0;font-size:13px;color:#a3a3a3;">If you didn't sign up for DevStash, you can safely ignore this email.</p>
    </div>
  </body>
</html>`;

  const text = `${greeting}

Verify your email for DevStash (link expires in 24 hours):
${verifyUrl}

If you didn't sign up, ignore this email.`;

  await sendEmail({
    to,
    subject: "Verify your DevStash email",
    html,
    text,
  });
}

export type ConsumeResult =
  | { ok: true; userId: string }
  | { ok: false; reason: "invalid" | "expired" };

export async function consumeVerificationToken(
  rawToken: string
): Promise<ConsumeResult> {
  const tokenHash = hashVerificationToken(rawToken);
  const record = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash },
  });

  if (!record) return { ok: false, reason: "invalid" };

  if (record.expiresAt.getTime() < Date.now()) {
    await prisma.emailVerificationToken
      .delete({ where: { id: record.id } })
      .catch(() => undefined);
    return { ok: false, reason: "expired" };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: new Date() },
    }),
    prisma.emailVerificationToken.delete({ where: { id: record.id } }),
  ]);

  return { ok: true, userId: record.userId };
}
