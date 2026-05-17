import Link from "next/link";
import { Star } from "lucide-react";

import { typeIconsBySlug } from "@/lib/type-icons";
import type { MockCollection } from "@/lib/mock-data";

interface CollectionCardProps {
  collection: MockCollection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Link
      href={`/collections/${collection.id}`}
      className="flex flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:border-foreground/30 hover:bg-card/80"
    >
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-foreground">{collection.name}</h3>
        {collection.isFavorite ? (
          <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
        ) : null}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{collection.itemCount} items</div>
      <p className="mt-3 text-sm text-muted-foreground">{collection.description}</p>
      <div className="mt-4 flex items-center gap-2 text-muted-foreground">
        {collection.itemTypeSlugs.map((slug) => {
          const Icon = typeIconsBySlug[slug];
          return <Icon key={slug} className="size-3.5" />;
        })}
      </div>
    </Link>
  );
}
