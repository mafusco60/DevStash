import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getSidebarCollections } from "@/lib/db/collections";
import { getProfileStats, getSidebarItemTypes } from "@/lib/db/items";
import { prisma } from "@/lib/prisma";

import { ProfileHeader } from "./ProfileHeader";
import { ProfileStats } from "./ProfileStats";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/profile");
  }
  const userId = session.user.id;

  const [user, itemTypes, collections, stats] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        password: true,
        isPro: true,
        createdAt: true,
      },
    }),
    getSidebarItemTypes({ userId }),
    getSidebarCollections({ userId }),
    getProfileStats({ userId }),
  ]);

  // The session is valid but the DB row is gone — only happens immediately
  // after a self-delete before the cookie is cleared. Force sign-out by
  // redirecting through the proxy gate.
  if (!user) {
    redirect("/sign-in?deleted=1");
  }

  return (
    <DashboardShell
      user={{
        name: user.name,
        email: user.email,
        image: user.image,
      }}
      itemTypes={itemTypes}
      collections={collections}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <ProfileHeader
          name={user.name}
          email={user.email}
          image={user.image}
          isPro={user.isPro}
          hasPassword={user.password !== null}
          createdAt={user.createdAt}
        />
        <ProfileStats stats={stats} />
      </div>
    </DashboardShell>
  );
}
