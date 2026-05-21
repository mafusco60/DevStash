import { sendEmail } from "@/lib/email";
import {
  VerificationTokenPurpose,
  findToken,
  issueToken,
} from "@/lib/verification-tokens";

export const PASSWORD_RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function buildPasswordResetUrl(token: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const url = new URL("/reset-password", base);
  url.searchParams.set("token", token);
  return url.toString();
}

export async function issuePasswordResetToken(userId: string) {
  return issueToken({
    userId,
    purpose: VerificationTokenPurpose.PASSWORD_RESET,
    ttlMs: PASSWORD_RESET_TOKEN_TTL_MS,
  });
}

export async function findPasswordResetToken(rawToken: string) {
  return findToken({
    rawToken,
    purpose: VerificationTokenPurpose.PASSWORD_RESET,
  });
}

export async function sendPasswordResetEmail({
  to,
  name,
  token,
}: {
  to: string;
  name: string | null;
  token: string;
}) {
  const resetUrl = buildPasswordResetUrl(token);
  const greeting = name ? `Hi ${name},` : "Hi,";

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#0a0a0a;color:#e5e5e5;font-family:ui-sans-serif,system-ui,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#171717;border:1px solid #262626;border-radius:8px;padding:24px;line-height:1.6;">
      <h1 style="margin:0 0 16px;font-size:20px;color:#fafafa;">Reset your password</h1>
      <p style="margin:0 0 12px;">${greeting}</p>
      <p style="margin:0 0 16px;">We received a request to reset the password for your DevStash account. Click the button below to choose a new password. This link expires in 1 hour.</p>
      <p style="margin:0 0 24px;">
        <a href="${resetUrl}" style="display:inline-block;background:#fafafa;color:#0a0a0a;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:600;">Reset my password</a>
      </p>
      <p style="margin:0 0 12px;font-size:13px;color:#a3a3a3;">Or paste this URL into your browser:<br><span style="word-break:break-all;color:#d4d4d4;">${resetUrl}</span></p>
      <p style="margin:24px 0 0;font-size:13px;color:#a3a3a3;">If you didn't request a password reset, you can safely ignore this email — your password won't change.</p>
    </div>
  </body>
</html>`;

  const text = `${greeting}

We received a request to reset the password for your DevStash account.
Use this link to choose a new password (expires in 1 hour):
${resetUrl}

If you didn't request a reset, ignore this email — your password won't change.`;

  await sendEmail({
    to,
    subject: "Reset your DevStash password",
    html,
    text,
  });
}
