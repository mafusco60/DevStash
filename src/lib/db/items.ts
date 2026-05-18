import { prisma } from "@/lib/prisma";

export interface DashboardItemType {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
}

export interface DashboardItem {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  updatedAt: Date;
  type: DashboardItemType;
  tags: string[];
}

const ITEM_INCLUDE = {
  type: { select: { id: true, name: true, icon: true, color: true } },
  tags: { select: { tag: { select: { name: true } } } },
} as const;

type ItemWithRelations = {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  updatedAt: Date;
  type: DashboardItemType;
  tags: { tag: { name: string } }[];
};

function toDashboardItem(item: ItemWithRelations): DashboardItem {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    updatedAt: item.updatedAt,
    type: item.type,
    tags: item.tags.map((entry) => entry.tag.name),
  };
}

interface GetItemsArgs {
  userId: string;
  limit?: number;
}

export async function getPinnedItems({ userId }: { userId: string }): Promise<DashboardItem[]> {
  const items = await prisma.item.findMany({
    where: { userId, isPinned: true },
    orderBy: { updatedAt: "desc" },
    include: ITEM_INCLUDE,
  });
  return items.map(toDashboardItem);
}

export async function getRecentItems({ userId, limit = 10 }: GetItemsArgs): Promise<DashboardItem[]> {
  const items = await prisma.item.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: ITEM_INCLUDE,
  });
  return items.map(toDashboardItem);
}

export interface SidebarItemType {
  id: string;
  label: string;
  slug: string;
  icon: string | null;
  color: string | null;
  count: number;
}

// Defines the canonical sidebar order for built-in system types. Names match
// `ItemType.name` rows seeded in prisma/seed.ts.
const SYSTEM_TYPE_ORDER = ["snippet", "prompt", "command", "note", "file", "image", "link"];

export async function getSidebarItemTypes({ userId }: { userId: string }): Promise<SidebarItemType[]> {
  const [types, counts] = await Promise.all([
    prisma.itemType.findMany({ where: { isSystem: true } }),
    prisma.item.groupBy({
      by: ["typeId"],
      where: { userId },
      _count: { _all: true },
    }),
  ]);
  const countByType = new Map(counts.map((c) => [c.typeId, c._count._all]));
  const byName = new Map(types.map((t) => [t.name, t]));
  return SYSTEM_TYPE_ORDER.flatMap((name) => {
    const type = byName.get(name);
    if (!type) return [];
    return [
      {
        id: type.id,
        label: `${name.charAt(0).toUpperCase()}${name.slice(1)}s`,
        slug: `${name}s`,
        icon: type.icon,
        color: type.color,
        count: countByType.get(type.id) ?? 0,
      },
    ];
  });
}

export interface DashboardStats {
  itemCount: number;
  collectionCount: number;
  favoriteItemCount: number;
  favoriteCollectionCount: number;
}

export async function getDashboardStats({ userId }: { userId: string }): Promise<DashboardStats> {
  const [itemCount, collectionCount, favoriteItemCount, favoriteCollectionCount] = await Promise.all([
    prisma.item.count({ where: { userId } }),
    prisma.collection.count({ where: { userId } }),
    prisma.item.count({ where: { userId, isFavorite: true } }),
    prisma.collection.count({ where: { userId, isFavorite: true } }),
  ]);
  return { itemCount, collectionCount, favoriteItemCount, favoriteCollectionCount };
}
