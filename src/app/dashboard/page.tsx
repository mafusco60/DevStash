import { DashboardMain } from "@/components/dashboard/DashboardMain";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getSidebarCollections } from "@/lib/db/collections";
import { getSidebarItemTypes } from "@/lib/db/items";
import { prisma } from "@/lib/prisma";

const DEMO_USER_EMAIL = "demo@devstash.io";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true, name: true, email: true },
  });

  const [itemTypes, collections] = user
    ? await Promise.all([
        getSidebarItemTypes({ userId: user.id }),
        getSidebarCollections({ userId: user.id }),
      ])
    : [[], { favorites: [], recents: [] }];

  return (
    <DashboardShell
      user={{
        name: user?.name ?? "Guest",
        email: user?.email ?? "",
      }}
      itemTypes={itemTypes}
      collections={collections}
    >
      <DashboardMain />
    </DashboardShell>
  );
}
