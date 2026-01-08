"use client";

import { useState } from "react";
import { trpc } from "@/shared/lib/trpc";

type ActionType = "activate" | "deactivate" | "promote" | "demote" | null;

interface ActionDialogState {
  type: ActionType;
  userId: string | null;
  userName: string | null;
}

export function useUserActions() {
  const [actionDialog, setActionDialog] = useState<ActionDialogState>({
    type: null,
    userId: null,
    userName: null,
  });

  const utils = trpc.useUtils();

  const setStatusMutation = trpc.admin.setUserActiveStatus.useMutation({
    onSuccess: () => {
      utils.admin.getUsers.invalidate();
      closeDialog();
    },
  });

  const setRoleMutation = trpc.admin.setUserRole.useMutation({
    onSuccess: () => {
      utils.admin.getUsers.invalidate();
      closeDialog();
    },
  });

  const closeDialog = () => {
    setActionDialog({ type: null, userId: null, userName: null });
  };

  const openDialog = (
    type: ActionType,
    userId: string,
    userName: string
  ) => {
    setActionDialog({ type, userId, userName });
  };

  const executeAction = async () => {
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

  return {
    actionDialog,
    openDialog,
    closeDialog,
    executeAction,
    getDialogContent,
    isPending: setStatusMutation.isPending || setRoleMutation.isPending,
    isDialogOpen: !!actionDialog.type,
  };
}
