import { FolderHeart, FolderOpen, Heart, Package } from "lucide-react";

import { mockCollections, mockItems } from "@/lib/mock-data";

const stats = [
  {
    label: "Items",
    value: mockItems.length,
    icon: Package,
  },
  {
    label: "Collections",
    value: mockCollections.length,
    icon: FolderOpen,
  },
  {
    label: "Favorite Items",
    value: mockItems.filter((item) => item.isFavorite).length,
    icon: Heart,
  },
  {
    label: "Favorite Collections",
    value: mockCollections.filter((collection) => collection.isFavorite).length,
    icon: FolderHeart,
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((stat) => {
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
