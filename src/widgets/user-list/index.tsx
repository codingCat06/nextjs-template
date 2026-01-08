"use client";

import { Loader2, User } from "lucide-react";
import { trpc } from "@/shared/lib/trpc";
import { useUserActions } from "@/features/user-management";
import { UserRow } from "./ui/user-row";
import { ActionDialog } from "./ui/action-dialog";

export function UserList() {
  const { data: users, isLoading } = trpc.admin.getUsers.useQuery();
  const {
    actionDialog,
    openDialog,
    closeDialog,
    executeAction,
    getDialogContent,
    isPending,
    isDialogOpen,
  } = useUserActions();

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
          <UserRow
            key={user.id}
            user={user}
            onActivate={() => openDialog("activate", user.id, user.name)}
            onDeactivate={() => openDialog("deactivate", user.id, user.name)}
            onPromote={() => openDialog("promote", user.id, user.name)}
            onDemote={() => openDialog("demote", user.id, user.name)}
          />
        ))}
      </div>

      {dialogContent && (
        <ActionDialog
          open={isDialogOpen}
          onOpenChange={(open) => !open && closeDialog()}
          title={dialogContent.title}
          description={dialogContent.description}
          buttonText={dialogContent.buttonText}
          variant={dialogContent.variant}
          onConfirm={executeAction}
          isPending={isPending}
        />
      )}
    </>
  );
}
