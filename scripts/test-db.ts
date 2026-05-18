import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not set. Add it to .env and retry.");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

const DEMO_EMAIL = "demo@devstash.io";
const DEMO_PASSWORD = "12345678";

async function main() {
  const host = new URL(databaseUrl!).host;
  console.log(`Connecting to ${host}…`);
  await prisma.$queryRaw`SELECT 1`;
  console.log("✓ Connection ok\n");

  const counts = {
    users: await prisma.user.count(),
    itemTypes: await prisma.itemType.count(),
    collections: await prisma.collection.count(),
    items: await prisma.item.count(),
    tags: await prisma.tag.count(),
    itemTags: await prisma.itemTag.count(),
  };
  console.table(counts);

  const user = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    include: {
      collections: {
        orderBy: { name: "asc" },
        include: {
          items: {
            orderBy: { createdAt: "asc" },
            include: { type: true },
          },
        },
      },
    },
  });

  if (!user) {
    console.error(`✗ Demo user (${DEMO_EMAIL}) not found. Run \`npx prisma db seed\`.`);
    process.exitCode = 1;
    return;
  }

  console.log(`Demo user: ${user.name} <${user.email}>`);
  console.log(`  isPro=${user.isPro}, emailVerified=${user.emailVerified?.toISOString() ?? "(unset)"}`);
  const passwordOk = user.password
    ? await bcrypt.compare(DEMO_PASSWORD, user.password)
    : false;
  console.log(
    `  password: ${user.password ? "(bcrypt hash, " + user.password.length + " chars)" : "(missing)"} — verify '${DEMO_PASSWORD}': ${passwordOk ? "✓" : "✗"}`,
  );

  const types = await prisma.itemType.findMany({
    where: { isSystem: true },
    orderBy: { name: "asc" },
  });
  console.log(`\nSystem item types (${types.length}):`);
  for (const t of types) {
    console.log(`  ${t.name.padEnd(8)}  icon=${t.icon?.padEnd(11)}  color=${t.color}`);
  }

  console.log(`\nCollections (${user.collections.length}):`);
  for (const c of user.collections) {
    const fav = c.isFavorite ? " [favorite]" : "";
    console.log(`\n  ${c.name}${fav}`);
    console.log(`    ${c.description}`);
    for (const item of c.items) {
      const flags = [
        item.isPinned ? "[pinned]" : "",
        item.isFavorite ? "[favorite]" : "",
      ]
        .filter(Boolean)
        .join(" ");
      const suffix = item.url ? `  → ${item.url}` : "";
      console.log(
        `      [${item.type.name}] ${item.title}${flags ? "  " + flags : ""}${suffix}`,
      );
    }
  }

  const pinned = await prisma.item.findMany({
    where: { isPinned: true, userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { type: true },
  });
  console.log(`\nPinned items (${pinned.length}):`);
  for (const p of pinned) {
    console.log(`  - [${p.type.name}] ${p.title}`);
  }

  const favorites = await prisma.item.findMany({
    where: { isFavorite: true, userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { type: true },
  });
  console.log(`\nFavorited items (${favorites.length}):`);
  for (const f of favorites) {
    console.log(`  - [${f.type.name}] ${f.title}`);
  }
}

main()
  .then(() => {
    if (process.exitCode !== 1) console.log("\n✓ Database test complete.");
  })
  .catch((err) => {
    console.error("\n✗ Database test failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
