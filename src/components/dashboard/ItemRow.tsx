import Link from "next/link";
import { Pin, Star } from "lucide-react";

import { typeIconsBySlug } from "@/lib/type-icons";
import type { MockItem } from "@/lib/mock-data";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(iso: string) {
  const [, m, d] = iso.split("-");
  return `${MONTHS[Number(m) - 1]} ${Number(d)}`;
}

interface ItemRowProps {
  item: MockItem;
}

export function ItemRow({ item }: ItemRowProps) {
  const Icon = typeIconsBySlug[item.typeSlug];
  return (
    <Link
      href={`/items/${item.id}`}
      className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-foreground/30 hover:bg-card/80"
    >
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-md bg-sidebar-accent text-muted-foreground">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="truncate text-sm font-semibold text-foreground">{item.title}</h4>
          {item.isPinned ? <Pin className="size-3.5 text-muted-foreground" /> : null}
          {item.isFavorite ? (
            <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
          ) : null}
        </div>
        <p className="mt-1 truncate text-sm text-muted-foreground">{item.description}</p>
        {item.tags.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-sidebar-accent px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <span className="shrink-0 text-xs text-muted-foreground">{formatDate(item.updatedAt)}</span>
    </Link>
  );
}
