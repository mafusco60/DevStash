import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface UserAvatarUser {
  name: string | null;
  email: string;
  image: string | null;
}

interface UserAvatarProps {
  user: UserAvatarUser;
  className?: string;
  size?: "default" | "sm" | "lg";
}

export function UserAvatar({ user, className, size = "default" }: UserAvatarProps) {
  const displayName = user.name ?? user.email;
  const initials = displayName
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Avatar size={size} className={cn(className)}>
      {user.image ? <AvatarImage src={user.image} alt={displayName} /> : null}
      <AvatarFallback>{initials || "?"}</AvatarFallback>
    </Avatar>
  );
}
