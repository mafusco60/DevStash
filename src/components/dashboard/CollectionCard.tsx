import Link from "next/link";
import { Star } from "lucide-react";

import { iconsByLucideName } from "@/lib/type-icons";
import type { DashboardCollection } from "@/lib/db/collections";

interface CollectionCardProps {
  collection: DashboardCollection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const borderColor = collection.primaryTypeColor ?? undefined;
  return (
    <Link
      href={`/collections/${collection.id}`}
      style={borderColor ? { borderLeftColor: borderColor } : undefined}
      className="flex flex-col rounded-lg border border-l-4 border-border bg-card p-4 transition-colors hover:border-foreground/30 hover:bg-card/80"
    >
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-foreground">{collection.name}</h3>
        {collection.isFavorite ? (
          <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
        ) : null}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        {collection.itemCount} {collection.itemCount === 1 ? "item" : "items"}
      </div>
      {collection.description ? (
        <p className="mt-3 text-sm text-muted-foreground">{collection.description}</p>
      ) : null}
      {collection.types.length > 0 ? (
        <div className="mt-4 flex items-center gap-2 text-muted-foreground">
          {collection.types.map((type) => {
            const Icon = type.icon ? iconsByLucideName[type.icon] : null;
            if (!Icon) return null;
            return (
              <Icon
                key={type.id}
                className="size-3.5"
                style={type.color ? { color: type.color } : undefined}
              />
            );
          })}
        </div>
      ) : null}
    </Link>
  );
}
