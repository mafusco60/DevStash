import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";
import {
  mockCollections,
  mockItems,
  mockItemTypes,
  mockUser,
} from "../src/lib/mock-data";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const TEXT_TYPES = new Set(["snippet", "prompt", "command", "note", "url"]);

async function main() {
  console.log("Seeding system ItemTypes…");
  for (const type of mockItemTypes) {
    await prisma.itemType.upsert({
      where: { id: `type_${type.slug}` },
      update: { name: type.name, icon: type.icon },
      create: {
        id: `type_${type.slug}`,
        name: type.name,
        icon: type.icon,
        isSystem: true,
      },
    });
  }

  console.log(`Seeding demo user (${mockUser.email})…`);
  const user = await prisma.user.upsert({
    where: { email: mockUser.email },
    update: { name: mockUser.name, isPro: mockUser.isPro },
    create: {
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      isPro: mockUser.isPro,
    },
  });

  console.log(`Seeding ${mockCollections.length} collections…`);
  for (const collection of mockCollections) {
    await prisma.collection.upsert({
      where: { id: collection.id },
      update: {
        name: collection.name,
        description: collection.description,
        isFavorite: collection.isFavorite,
        updatedAt: new Date(collection.updatedAt),
      },
      create: {
        id: collection.id,
        name: collection.name,
        description: collection.description,
        isFavorite: collection.isFavorite,
        userId: user.id,
        updatedAt: new Date(collection.updatedAt),
      },
    });
  }

  console.log(`Seeding ${mockItems.length} items + tags…`);
  for (const item of mockItems) {
    const contentType = TEXT_TYPES.has(item.typeSlug) ? "text" : "file";

    await prisma.item.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        description: item.description,
        isFavorite: item.isFavorite,
        isPinned: item.isPinned,
        language: item.language,
        updatedAt: new Date(item.updatedAt),
      },
      create: {
        id: item.id,
        title: item.title,
        description: item.description,
        contentType,
        isFavorite: item.isFavorite,
        isPinned: item.isPinned,
        language: item.language,
        userId: user.id,
        typeId: `type_${item.typeSlug}`,
        collectionId: item.collectionId,
        updatedAt: new Date(item.updatedAt),
      },
    });

    for (const tagName of item.tags) {
      const tag = await prisma.tag.upsert({
        where: { userId_name: { userId: user.id, name: tagName } },
        update: {},
        create: { name: tagName, userId: user.id },
      });
      await prisma.itemTag.upsert({
        where: { itemId_tagId: { itemId: item.id, tagId: tag.id } },
        update: {},
        create: { itemId: item.id, tagId: tag.id },
      });
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
