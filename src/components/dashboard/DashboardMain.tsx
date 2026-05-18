import Link from "next/link";
import { Pin } from "lucide-react";

import { CollectionCard } from "@/components/dashboard/CollectionCard";
import { ItemRow } from "@/components/dashboard/ItemRow";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { getRecentCollections } from "@/lib/db/collections";
import { mockItems } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";

const DEMO_USER_EMAIL = "demo@devstash.io";

const pinnedItems = mockItems.filter((item) => item.isPinned);
const recentItems = [...mockItems]
  .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  .slice(0, 10);

export async function DashboardMain() {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true },
  });
  if (!user) {
    throw new Error(
      `Demo user not found (${DEMO_USER_EMAIL}). Run \`prisma db seed\` against the dev database.`,
    );
  }
  const recentCollections = await getRecentCollections({ userId: user.id, limit: 6 });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your developer knowledge hub</p>
      </header>

      <StatsCards />

      <section>
        <SectionHeader title="Collections" viewAllHref="/collections" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </section>

      {pinnedItems.length > 0 ? (
        <section>
          <SectionHeader
            title={
              <span className="flex items-center gap-2">
                <Pin className="size-4 text-muted-foreground" />
                Pinned
              </span>
            }
          />
          <div className="space-y-2">
            {pinnedItems.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <SectionHeader title="Recent Items" viewAllHref="/items" />
        <div className="space-y-2">
          {recentItems.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}

interface SectionHeaderProps {
  title: React.ReactNode;
  viewAllHref?: string;
}

function SectionHeader({ title, viewAllHref }: SectionHeaderProps) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {viewAllHref ? (
        <Link href={viewAllHref} className="text-sm text-muted-foreground hover:text-foreground">
          View all
        </Link>
      ) : null}
    </div>
  );
}
