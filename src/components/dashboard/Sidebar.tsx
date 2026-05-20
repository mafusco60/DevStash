"use client";

import Link from "next/link";
import { useCallback } from "react";
import { ChevronDown, Layers, Star, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/auth/UserMenu";
import { Badge } from "@/components/ui/badge";
import type { SidebarCollections, DashboardCollection } from "@/lib/db/collections";
import type { SidebarItemType } from "@/lib/db/items";
import { iconsByLucideName } from "@/lib/type-icons";

const PRO_TYPE_SLUGS = new Set(["files", "images"]);

export interface SidebarUser {
  name: string | null;
  email: string;
  image: string | null;
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  user: SidebarUser;
  itemTypes: SidebarItemType[];
  collections: SidebarCollections;
}

export function Sidebar({ open, onClose, user, itemTypes, collections }: SidebarProps) {
  const handleNavigate = useCallback(() => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 767.98px)").matches) {
      onClose();
    }
  }, [onClose]);

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 ease-out md:relative md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full md:hidden",
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
          <Link
            href="/dashboard"
            onClick={handleNavigate}
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <span className="grid size-7 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
              <Layers className="size-4" />
            </span>
            DevStash
          </Link>
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav aria-label="Primary" className="flex-1 overflow-y-auto px-2 py-3">
          <SidebarSection title="Types" defaultOpen>
            <ul className="mt-1 space-y-0.5">
              {itemTypes.map((type) => {
                const Icon = type.icon ? iconsByLucideName[type.icon] : null;
                return (
                  <li key={type.id}>
                    <Link
                      href={`/items/${type.slug}`}
                      onClick={handleNavigate}
                      className="group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                      {Icon ? (
                        <Icon
                          className="size-4"
                          style={type.color ? { color: type.color } : undefined}
                        />
                      ) : null}
                      <span className="flex-1 truncate">{type.label}</span>
                      {PRO_TYPE_SLUGS.has(type.slug) ? (
                        <Badge
                          variant="secondary"
                          className="h-4 px-1.5 text-[10px] font-semibold tracking-wider"
                        >
                          PRO
                        </Badge>
                      ) : null}
                      <span className="text-xs text-muted-foreground">{type.count}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </SidebarSection>

          <SidebarSection title="Collections" defaultOpen>
            {collections.favorites.length > 0 ? (
              <>
                <SidebarGroupLabel>Favorites</SidebarGroupLabel>
                <ul className="space-y-0.5">
                  {collections.favorites.map((collection) => (
                    <li key={collection.id}>
                      <Link
                        href={`/collections/${collection.id}`}
                        onClick={handleNavigate}
                        className="group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      >
                        <Star className="size-4 fill-yellow-400 text-yellow-400" />
                        <span className="flex-1 truncate">{collection.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {collections.recents.length > 0 ? (
              <>
                <SidebarGroupLabel className="mt-3">All Collections</SidebarGroupLabel>
                <ul className="space-y-0.5">
                  {collections.recents.map((collection) => (
                    <li key={collection.id}>
                      <RecentCollectionLink
                        collection={collection}
                        onNavigate={handleNavigate}
                      />
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            <Link
              href="/collections"
              onClick={handleNavigate}
              className="mt-3 block rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              View all collections
            </Link>
          </SidebarSection>
        </nav>

        <UserMenu user={user} />
      </aside>
    </>
  );
}

interface RecentCollectionLinkProps {
  collection: DashboardCollection;
  onNavigate: () => void;
}

function RecentCollectionLink({ collection, onNavigate }: RecentCollectionLinkProps) {
  const dotColor = collection.primaryTypeColor ?? undefined;
  return (
    <Link
      href={`/collections/${collection.id}`}
      onClick={onNavigate}
      className="group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    >
      <span
        aria-hidden
        className="size-2.5 shrink-0 rounded-full bg-muted-foreground/40"
        style={dotColor ? { backgroundColor: dotColor } : undefined}
      />
      <span className="flex-1 truncate">{collection.name}</span>
      <span className="text-xs text-muted-foreground">{collection.itemCount}</span>
    </Link>
  );
}

interface SidebarSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function SidebarSection({
  title,
  defaultOpen = true,
  children,
}: SidebarSectionProps) {
  return (
    <details open={defaultOpen} className="group mb-4">
      <summary className="flex w-full cursor-pointer list-none items-center gap-1 rounded-md px-2 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-sidebar-foreground [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="size-3.5 -rotate-90 transition-transform group-open:rotate-0" />
      </summary>
      {children}
    </details>
  );
}

function SidebarGroupLabel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70",
        className,
      )}
    >
      {children}
    </div>
  );
}

