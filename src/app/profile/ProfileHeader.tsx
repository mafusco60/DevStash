import { UserAvatar } from "@/components/auth/UserAvatar";
import { Badge } from "@/components/ui/badge";

import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { DeleteAccountDialog } from "./DeleteAccountDialog";

interface ProfileHeaderProps {
  name: string | null;
  email: string;
  image: string | null;
  isPro: boolean;
  hasPassword: boolean;
  createdAt: Date;
}

function formatMemberSince(date: Date) {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function ProfileHeader({
  name,
  email,
  image,
  isPro,
  hasPassword,
  createdAt,
}: ProfileHeaderProps) {
  const displayName = name ?? email;
  return (
    <header className="flex items-center gap-4">
      <UserAvatar user={{ name, email, image }} size="lg" />
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {displayName}
          </h1>
          {isPro ? (
            <Badge
              variant="secondary"
              className="h-4 px-1.5 text-[10px] font-semibold tracking-wider"
            >
              PRO
            </Badge>
          ) : null}
        </div>
        <p className="text-sm text-muted-foreground">{email}</p>
        <p className="text-xs text-muted-foreground">
          Member since {formatMemberSince(createdAt)}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {hasPassword ? <ChangePasswordDialog /> : null}
          <DeleteAccountDialog email={email} />
        </div>
      </div>
    </header>
  );
}
