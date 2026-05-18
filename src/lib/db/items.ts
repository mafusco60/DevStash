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
