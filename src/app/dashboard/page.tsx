import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { DashboardMain } from "@/components/dashboard/DashboardMain";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getSidebarCollections } from "@/lib/db/collections";
import { getSidebarItemTypes } from "@/lib/db/items";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/dashboard");
  }
  const userId = session.user.id;

  const [itemTypes, collections] = await Promise.all([
    getSidebarItemTypes({ userId }),
    getSidebarCollections({ userId }),
  ]);

  return (
    <DashboardShell
      user={{
        name: session.user.name ?? null,
        email: session.user.email ?? "",
        image: session.user.image ?? null,
      }}
      itemTypes={itemTypes}
      collections={collections}
    >
      <DashboardMain userId={userId} />
    </DashboardShell>
  );
}
