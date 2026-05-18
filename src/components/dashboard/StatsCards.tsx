import { FolderHeart, FolderOpen, Heart, Package } from "lucide-react";

import type { DashboardStats } from "@/lib/db/items";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const entries = [
    { label: "Items", value: stats.itemCount, icon: Package },
    { label: "Collections", value: stats.collectionCount, icon: FolderOpen },
    { label: "Favorite Items", value: stats.favoriteItemCount, icon: Heart },
    { label: "Favorite Collections", value: stats.favoriteCollectionCount, icon: FolderHeart },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {entries.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
              <Icon className="size-4 text-muted-foreground" />
            </div>
            <div className="mt-2 text-2xl font-semibold text-foreground">{stat.value}</div>
          </div>
        );
      })}
    </div>
  );
}
