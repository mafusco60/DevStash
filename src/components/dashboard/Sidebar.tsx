"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  Code,
  File,
  FileText,
  Image as ImageIcon,
  Layers,
  Link as LinkIcon,
  Settings,
  Sparkles,
  Star,
  Terminal,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  mockCollections,
  mockItemTypes,
  mockUser,
  type MockItemType,
} from "@/lib/mock-data";

const typeIcons: Record<MockItemType["icon"], React.ComponentType<{ className?: string }>> = {
  code: Code,
  sparkles: Sparkles,
  terminal: Terminal,
  "file-text": FileText,
  file: File,
  image: ImageIcon,
  link: LinkIcon,
};

function typeRoute(type: MockItemType) {
  return `/items/${type.name.toLowerCase()}`;
}

const favoriteCollections = mockCollections.filter((c) => c.isFavorite);
const recentCollections = mockCollections.filter((c) => !c.isFavorite);

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
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
        aria-label="Primary navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 ease-out md:relative md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full md:hidden",
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm font-semibold">
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

        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <SidebarSection title="Types" defaultOpen>
            <ul className="mt-1 space-y-0.5">
              {mockItemTypes.map((type) => {
                const Icon = typeIcons[type.icon] ?? File;
                return (
                  <li key={type.id}>
                    <Link
                      href={typeRoute(type)}
                      className="group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                      <Icon className="size-4 text-muted-foreground group-hover:text-sidebar-accent-foreground" />
                      <span className="flex-1 truncate">{type.name}</span>
                      <span className="text-xs text-muted-foreground">{type.count}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </SidebarSection>

          <SidebarSection title="Collections" defaultOpen>
            <SidebarGroupLabel>Favorites</SidebarGroupLabel>
            <ul className="space-y-0.5">
              {favoriteCollections.map((collection) => (
                <li key={collection.id}>
                  <Link
                    href={`/collections/${collection.id}`}
                    className="group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <Star className="size-4 fill-yellow-400 text-yellow-400" />
                    <span className="flex-1 truncate">{collection.name}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <SidebarGroupLabel className="mt-3">Most Recent</SidebarGroupLabel>
            <ul className="space-y-0.5">
              {recentCollections.map((collection) => (
                <li key={collection.id}>
                  <Link
                    href={`/collections/${collection.id}`}
                    className="group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <Layers className="size-4 text-muted-foreground group-hover:text-sidebar-accent-foreground" />
                    <span className="flex-1 truncate">{collection.name}</span>
                    <span className="text-xs text-muted-foreground">{collection.itemCount}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </SidebarSection>
        </nav>

        <SidebarUser />
      </aside>
    </>
  );
}

interface SidebarSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function SidebarSection({ title, defaultOpen = true, children }: SidebarSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-1 rounded-md px-2 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-sidebar-foreground"
      >
        {title}
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform",
            isOpen ? "rotate-0" : "-rotate-90",
          )}
        />
      </button>
      {isOpen ? children : null}
    </div>
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

function SidebarUser() {
  const initials = mockUser.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-3 border-t border-sidebar-border px-3 py-3">
      <div className="grid size-9 shrink-0 place-items-center rounded-full bg-sidebar-accent text-sm font-medium text-sidebar-accent-foreground">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-sidebar-foreground">{mockUser.name}</div>
        <div className="truncate text-xs text-muted-foreground">{mockUser.email}</div>
      </div>
      <button
        type="button"
        aria-label="Account settings"
        className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      >
        <Settings className="size-4" />
      </button>
    </div>
  );
}
