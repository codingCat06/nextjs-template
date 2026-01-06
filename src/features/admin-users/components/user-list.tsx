"use client";

import { useState } from "react";
import { Loader2, UserCheck, UserX, Shield, User } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ActionDialogState {
  type: "activate" | "deactivate" | "promote" | "demote" | null;
  userId: string | null;
  userName: string | null;
}

export function UserList() {
  const [actionDialog, setActionDialog] = useState<ActionDialogState>({
    type: null,
    userId: null,
    userName: null,
  });

  const { data: users, isLoading } = trpc.admin.getUsers.useQuery();
  const utils = trpc.useUtils();

  const setStatusMutation = trpc.admin.setUserActiveStatus.useMutation({
    onSuccess: () => {
      utils.admin.getUsers.invalidate();
      setActionDialog({ type: null, userId: null, userName: null });
    },
  });

  const setRoleMutation = trpc.admin.setUserRole.useMutation({
    onSuccess: () => {
      utils.admin.getUsers.invalidate();
      setActionDialog({ type: null, userId: null, userName: null });
    },
  });

  const handleAction = async () => {
    if (!actionDialog.userId || !actionDialog.type) return;

    switch (actionDialog.type) {
      case "activate":
        await setStatusMutation.mutateAsync({
          userId: actionDialog.userId,
          isActive: true,
        });
        break;
      case "deactivate":
        await setStatusMutation.mutateAsync({
          userId: actionDialog.userId,
          isActive: false,
        });
        break;
      case "promote":
        await setRoleMutation.mutateAsync({
          userId: actionDialog.userId,
          role: "admin",
        });
        break;
      case "demote":
        await setRoleMutation.mutateAsync({
          userId: actionDialog.userId,
          role: "user",
        });
        break;
    }
  };

  const isPending = setStatusMutation.isPending || setRoleMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
        <User className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">No users found</p>
      </div>
    );
  }

  const getDialogContent = () => {
    switch (actionDialog.type) {
      case "activate":
        return {
          title: "Activate User",
          description: `Are you sure you want to activate ${actionDialog.userName}? They will be able to access the application.`,
          buttonText: "Activate",
          variant: "default" as const,
        };
      case "deactivate":
        return {
          title: "Deactivate User",
          description: `Are you sure you want to deactivate ${actionDialog.userName}? They will no longer be able to access the application.`,
          buttonText: "Deactivate",
          variant: "destructive" as const,
        };
      case "promote":
        return {
          title: "Promote to Admin",
          description: `Are you sure you want to promote ${actionDialog.userName} to admin? They will have full access to admin features.`,
          buttonText: "Promote",
          variant: "default" as const,
        };
      case "demote":
        return {
          title: "Remove Admin",
          description: `Are you sure you want to remove admin privileges from ${actionDialog.userName}?`,
          buttonText: "Remove Admin",
          variant: "destructive" as const,
        };
      default:
        return null;
    }
  };

  const dialogContent = getDialogContent();

  return (
    <>
      <div className="rounded-lg border">
        <div className="grid grid-cols-[1fr,1fr,100px,100px,150px] gap-4 border-b bg-muted/50 p-4 text-sm font-medium">
          <div>Name</div>
          <div>Email</div>
          <div>Role</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        {users.map((user) => (
          <div
            key={user.id}
            className="grid grid-cols-[1fr,1fr,100px,100px,150px] gap-4 border-b p-4 text-sm last:border-b-0"
          >
            <div className="font-medium">{user.name}</div>
            <div className="text-muted-foreground">{user.email}</div>
            <div>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                  user.role === "admin"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {user.role === "admin" ? (
                  <Shield className="h-3 w-3" />
                ) : (
                  <User className="h-3 w-3" />
                )}
                {user.role}
              </span>
            </div>
            <div>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                  user.isActive
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                )}
              >
                {user.isActive ? "Active" : "Disabled"}
              </span>
            </div>
            <div className="flex gap-1">
              {user.isActive ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setActionDialog({
                      type: "deactivate",
                      userId: user.id,
                      userName: user.name,
                    })
                  }
                  title="Deactivate user"
                >
                  <UserX className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setActionDialog({
                      type: "activate",
                      userId: user.id,
                      userName: user.name,
                    })
                  }
                  title="Activate user"
                >
                  <UserCheck className="h-4 w-4" />
                </Button>
              )}
              {user.role === "admin" ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setActionDialog({
                      type: "demote",
                      userId: user.id,
                      userName: user.name,
                    })
                  }
                  title="Remove admin"
                >
                  <User className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setActionDialog({
                      type: "promote",
                      userId: user.id,
                      userName: user.name,
                    })
                  }
                  title="Promote to admin"
                >
                  <Shield className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={!!actionDialog.type}
        onOpenChange={() =>
          setActionDialog({ type: null, userId: null, userName: null })
        }
      >
        {dialogContent && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogContent.title}</DialogTitle>
              <DialogDescription>{dialogContent.description}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() =>
                  setActionDialog({ type: null, userId: null, userName: null })
                }
              >
                Cancel
              </Button>
              <Button
                variant={dialogContent.variant}
                onClick={handleAction}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {dialogContent.buttonText}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
