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

export async function getRecentCollections({
  userId,
  limit = 6,
}: GetRecentCollectionsArgs): Promise<DashboardCollection[]> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      items: {
        select: {
          type: {
            select: { id: true, name: true, icon: true, color: true },
          },
        },
      },
    },
  });

  return collections.map((collection) => {
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
  });
}
