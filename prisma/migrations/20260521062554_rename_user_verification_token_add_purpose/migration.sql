-- Rename EmailVerificationToken -> UserVerificationToken and add a `purpose`
-- discriminator. Data-preserving (ALTER TABLE RENAME) so existing tokens in
-- dev/prod survive; the new column defaults to EMAIL_VERIFY for back-fill.

-- CreateEnum
CREATE TYPE "VerificationTokenPurpose" AS ENUM ('EMAIL_VERIFY', 'PASSWORD_RESET');

-- RenameTable
ALTER TABLE "EmailVerificationToken" RENAME TO "UserVerificationToken";

-- RenameConstraint (primary key)
ALTER TABLE "UserVerificationToken" RENAME CONSTRAINT "EmailVerificationToken_pkey" TO "UserVerificationToken_pkey";

-- RenameConstraint (foreign key)
ALTER TABLE "UserVerificationToken" RENAME CONSTRAINT "EmailVerificationToken_userId_fkey" TO "UserVerificationToken_userId_fkey";

-- RenameIndex
ALTER INDEX "EmailVerificationToken_tokenHash_key" RENAME TO "UserVerificationToken_tokenHash_key";
ALTER INDEX "EmailVerificationToken_userId_idx" RENAME TO "UserVerificationToken_userId_idx";
ALTER INDEX "EmailVerificationToken_expiresAt_idx" RENAME TO "UserVerificationToken_expiresAt_idx";

-- AddColumn (defaulted so existing rows back-fill to EMAIL_VERIFY)
ALTER TABLE "UserVerificationToken" ADD COLUMN "purpose" "VerificationTokenPurpose" NOT NULL DEFAULT 'EMAIL_VERIFY';

-- Drop the default so future inserts must specify a purpose explicitly.
ALTER TABLE "UserVerificationToken" ALTER COLUMN "purpose" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "UserVerificationToken_userId_purpose_idx" ON "UserVerificationToken"("userId", "purpose");
