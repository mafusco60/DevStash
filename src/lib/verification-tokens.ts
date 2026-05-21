import { createHash, randomBytes } from "node:crypto";

import { VerificationTokenPurpose } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export { VerificationTokenPurpose };

export function hashToken(rawToken: string) {
  return createHash("sha256").update(rawToken).digest("hex");
}

export function generateRawToken() {
  return randomBytes(32).toString("base64url");
}

// Atomic "replace any outstanding tokens with a fresh one (scoped to this
// userId + purpose) and return the raw token". Returns the raw value — only
// the sha256 hash is persisted.
export async function issueToken({
  userId,
  purpose,
  ttlMs,
}: {
  userId: string;
  purpose: VerificationTokenPurpose;
  ttlMs: number;
}) {
  const token = generateRawToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + ttlMs);

  await prisma.$transaction([
    prisma.userVerificationToken.deleteMany({ where: { userId, purpose } }),
    prisma.userVerificationToken.create({
      data: { userId, purpose, tokenHash, expiresAt },
    }),
  ]);

  return token;
}

export type FindTokenResult =
  | { ok: true; tokenId: string; userId: string }
  | { ok: false; reason: "invalid" | "expired" };

// Read-only lookup keyed by hash + purpose. Expired tokens are best-effort
// deleted but the call always returns "expired" so the caller surfaces a
// consistent error. The "consume" step (the side effects of a successful
// reset/verify) is left to the caller so each purpose can run its own
// atomic transaction.
export async function findToken({
  rawToken,
  purpose,
}: {
  rawToken: string;
  purpose: VerificationTokenPurpose;
}): Promise<FindTokenResult> {
  const tokenHash = hashToken(rawToken);
  const record = await prisma.userVerificationToken.findUnique({
    where: { tokenHash },
  });

  if (!record || record.purpose !== purpose) {
    return { ok: false, reason: "invalid" };
  }

  if (record.expiresAt.getTime() < Date.now()) {
    await prisma.userVerificationToken
      .delete({ where: { id: record.id } })
      .catch(() => undefined);
    return { ok: false, reason: "expired" };
  }

  return { ok: true, tokenId: record.id, userId: record.userId };
}
