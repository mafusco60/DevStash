import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not set. Add it to .env and retry.");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  const host = new URL(databaseUrl!).host;
  console.log(`Connecting to ${host}…`);

  await prisma.$queryRaw`SELECT 1`;
  console.log("✓ Connection ok");

  const counts = {
    users: await prisma.user.count(),
    itemTypes: await prisma.itemType.count(),
    collections: await prisma.collection.count(),
    items: await prisma.item.count(),
    tags: await prisma.tag.count(),
    itemTags: await prisma.itemTag.count(),
  };
  console.table(counts);

  const sample = await prisma.item.findFirst({
    orderBy: { updatedAt: "desc" },
    select: {
      title: true,
      isPinned: true,
      isFavorite: true,
      type: { select: { name: true } },
      collection: { select: { name: true } },
      tags: { select: { tag: { select: { name: true } } } },
    },
  });
  console.log("Most recent item:", sample);
}

main()
  .then(() => {
    console.log("✓ Database test complete.");
  })
  .catch((err) => {
    console.error("✗ Database test failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
