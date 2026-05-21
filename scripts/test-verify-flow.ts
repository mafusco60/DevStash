/**
 * One-shot manual-test helper for the email-verification flow.
 *
 * Usage:
 *   npx tsx scripts/test-verify-flow.ts <email>
 *
 * Issues a fresh verification token for the given user (replacing any
 * outstanding ones) and prints the raw token + verify URL so you can curl
 * /api/auth/verify-email?token=… end-to-end without depending on actual
 * email delivery (Resend `onboarding@resend.dev` only delivers to the
 * account owner).
 */
import "dotenv/config";
import { createHash, randomBytes } from "node:crypto";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";

const TTL_MS = 24 * 60 * 60 * 1000;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not set. Add it to .env and retry.");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: tsx scripts/test-verify-flow.ts <email>");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`No user with email ${email}`);
    process.exit(1);
  }

  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + TTL_MS);

  await prisma.$transaction([
    prisma.emailVerificationToken.deleteMany({ where: { userId: user.id } }),
    prisma.emailVerificationToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    }),
  ]);

  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const verifyUrl = `${base}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

  console.log(
    JSON.stringify(
      {
        userId: user.id,
        email: user.email,
        emailVerifiedBefore: user.emailVerified,
        token,
        tokenHash,
        verifyUrl,
      },
      null,
      2
    )
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
