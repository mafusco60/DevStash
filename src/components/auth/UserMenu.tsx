"use client";

import { LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";

import { signOutAction } from "@/actions/auth";
import { UserAvatar, type UserAvatarUser } from "@/components/auth/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  user: UserAvatarUser;
}

export function UserMenu({ user }: UserMenuProps) {
  const displayName = user.name ?? user.email;
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label="Open user menu"
            className="flex w-full items-center gap-3 rounded-md border-t border-sidebar-border px-3 py-3 text-left hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-2 focus-visible:outline-ring"
          />
        }
      >
        <UserAvatar user={user} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-sidebar-foreground">
            {displayName}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {user.email}
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" sideOffset={8} className="w-56">
        <div className="flex flex-col px-1.5 py-1">
          <span className="text-sm font-medium">{displayName}</span>
          <span className="truncate text-xs text-muted-foreground">
            {user.email}
          </span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={
            <Link href="/profile">
              <UserIcon className="size-4" />
              Profile
            </Link>
          }
        />
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={isPending}
          onClick={() => startTransition(() => signOutAction())}
        >
          <LogOut className="size-4" />
          {isPending ? "Signing out…" : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
