"use client";

import { useState } from "react";

import { Sidebar, type SidebarUser } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import type { SidebarCollections } from "@/lib/db/collections";
import type { SidebarItemType } from "@/lib/db/items";

interface DashboardShellProps {
  user: SidebarUser;
  itemTypes: SidebarItemType[];
  collections: SidebarCollections;
  children: React.ReactNode;
}

export function DashboardShell({
  user,
  itemTypes,
  collections,
  children,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        itemTypes={itemTypes}
        collections={collections}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
