"use client";

import { Shield, User, UserCheck, UserX } from "lucide-react";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import type { UserListItem, UserRole } from "@/entities/user";

interface UserRowProps {
  user: UserListItem;
  onActivate: () => void;
  onDeactivate: () => void;
  onPromote: () => void;
  onDemote: () => void;
}

export function UserRow({
  user,
  onActivate,
  onDeactivate,
  onPromote,
  onDemote,
}: UserRowProps) {
  return (
    <div className="grid grid-cols-[1fr,1fr,100px,100px,150px] gap-4 border-b p-4 text-sm last:border-b-0">
      <div className="font-medium">{user.name}</div>
      <div className="text-muted-foreground">{user.email}</div>
      <div>
        <RoleBadge role={user.role} />
      </div>
      <div>
        <StatusBadge isActive={user.isActive} />
      </div>
      <div className="flex gap-1">
        {user.isActive ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDeactivate}
            title="Deactivate user"
          >
            <UserX className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={onActivate}
            title="Activate user"
          >
            <UserCheck className="h-4 w-4" />
          </Button>
        )}
        {user.role === "admin" ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDemote}
            title="Remove admin"
          >
            <User className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={onPromote}
            title="Promote to admin"
          >
            <Shield className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
        role === "admin"
          ? "bg-primary/10 text-primary"
          : "bg-muted text-muted-foreground"
      )}
    >
      {role === "admin" ? (
        <Shield className="h-3 w-3" />
      ) : (
        <User className="h-3 w-3" />
      )}
      {role}
    </span>
  );
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
        isActive
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      )}
    >
      {isActive ? "Active" : "Disabled"}
    </span>
  );
}
