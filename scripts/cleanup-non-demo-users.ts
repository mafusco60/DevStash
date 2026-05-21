/**
 * Delete every user (and all their owned content) except `demo@devstash.io`.
 *
 * Usage:
 *   npx tsx scripts/cleanup-non-demo-users.ts          # dry run (default)
 *   npx tsx scripts/cleanup-non-demo-users.ts --yes    # actually delete
 *
 * Targets whichever Neon branch DATABASE_URL points at. Cascade rules on the
 * schema (User → Account/Session/Item/ItemType/Collection/Tag/
 * UserVerificationToken, Item → ItemTag) handle the dependent rows.
 */
import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";

const KEEP_EMAIL = "demo@devstash.io";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not set. Add it to .env and retry.");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  const apply = process.argv.includes("--yes");
  const host = new URL(databaseUrl!).host;

  console.log(`Database host: ${host}`);
  console.log(`Mode: ${apply ? "APPLY (destructive)" : "dry run"}`);
  console.log(`Keeping: ${KEEP_EMAIL}`);
  console.log();

  const victims = await prisma.user.findMany({
    where: { email: { not: KEEP_EMAIL } },
    select: {
      id: true,
      email: true,
      name: true,
      _count: {
        select: {
          items: true,
          collections: true,
          itemTypes: true,
          tags: true,
          accounts: true,
          sessions: true,
          verificationTokens: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  if (victims.length === 0) {
    console.log("No users to delete.");
    return;
  }

  console.log(`Found ${victims.length} user(s) to delete:`);
  for (const u of victims) {
    const counts = Object.entries(u._count)
      .filter(([, n]) => n > 0)
      .map(([k, n]) => `${k}=${n}`)
      .join(", ");
    console.log(
      `  - ${u.email}${u.name ? ` (${u.name})` : ""} [${u.id}]${counts ? ` — ${counts}` : ""}`
    );
  }

  // Orphan custom (non-system) ItemTypes that survive the user deletes only
  // when their owner is the kept demo user. ItemType.userId cascades from User,
  // so any custom types owned by victims are removed automatically. System
  // types (userId is null, isSystem true) are left alone.
  const orphanCustomTypes = await prisma.itemType.count({
    where: { isSystem: false, userId: null },
  });
  if (orphanCustomTypes > 0) {
    console.log(`\nNote: ${orphanCustomTypes} orphaned custom ItemType row(s) already exist (userId=null, isSystem=false). They are not touched by this script.`);
  }

  if (!apply) {
    console.log("\nDry run — nothing was deleted. Re-run with --yes to apply.");
    return;
  }

  const result = await prisma.user.deleteMany({
    where: { email: { not: KEEP_EMAIL } },
  });
  console.log(`\nDeleted ${result.count} user(s). Cascades handled the rest.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
