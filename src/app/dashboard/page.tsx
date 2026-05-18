import { DashboardMain } from "@/components/dashboard/DashboardMain";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getSidebarCollections } from "@/lib/db/collections";
import { getSidebarItemTypes } from "@/lib/db/items";
import { prisma } from "@/lib/prisma";

const DEMO_USER_EMAIL = "demo@devstash.io";

export default async function DashboardPage() {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true, name: true, email: true },
  });
  if (!user) {
    throw new Error(
      `Demo user not found (${DEMO_USER_EMAIL}). Run \`prisma db seed\` against the dev database.`,
    );
  }

  const [itemTypes, collections] = await Promise.all([
    getSidebarItemTypes({ userId: user.id }),
    getSidebarCollections({ userId: user.id }),
  ]);

  return (
    <DashboardShell
      user={{ name: user.name, email: user.email }}
      itemTypes={itemTypes}
      collections={collections}
    >
      <DashboardMain />
    </DashboardShell>
  );
}
