import { prisma } from "@/lib/prisma";

export interface CollectionTypeBreakdown {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  count: number;
}

export interface DashboardCollection {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  updatedAt: Date;
  itemCount: number;
  types: CollectionTypeBreakdown[];
  primaryTypeColor: string | null;
}

interface GetRecentCollectionsArgs {
  userId: string;
  limit?: number;
}

const COLLECTION_TYPE_INCLUDE = {
  items: {
    select: {
      type: {
        select: { id: true, name: true, icon: true, color: true },
      },
    },
  },
} as const;

type CollectionItemTypeRow = {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
};

type CollectionWithItemTypes = {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  updatedAt: Date;
  items: { type: CollectionItemTypeRow }[];
};

function toDashboardCollection(collection: CollectionWithItemTypes): DashboardCollection {
  const typeCounts = new Map<string, CollectionTypeBreakdown>();
  for (const item of collection.items) {
    const existing = typeCounts.get(item.type.id);
    if (existing) {
      existing.count += 1;
    } else {
      typeCounts.set(item.type.id, { ...item.type, count: 1 });
    }
  }
  const types = [...typeCounts.values()].sort((a, b) => b.count - a.count);
  return {
    id: collection.id,
    name: collection.name,
    description: collection.description,
    isFavorite: collection.isFavorite,
    updatedAt: collection.updatedAt,
    itemCount: collection.items.length,
    types,
    primaryTypeColor: types[0]?.color ?? null,
  };
}

export async function getRecentCollections({
  userId,
  limit = 6,
}: GetRecentCollectionsArgs): Promise<DashboardCollection[]> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: COLLECTION_TYPE_INCLUDE,
  });
  return collections.map(toDashboardCollection);
}

export interface SidebarCollections {
  favorites: DashboardCollection[];
  recents: DashboardCollection[];
}

export async function getSidebarCollections({
  userId,
}: {
  userId: string;
}): Promise<SidebarCollections> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: COLLECTION_TYPE_INCLUDE,
  });
  const mapped = collections.map(toDashboardCollection);
  return {
    favorites: mapped.filter((c) => c.isFavorite),
    recents: mapped.filter((c) => !c.isFavorite),
  };
}
