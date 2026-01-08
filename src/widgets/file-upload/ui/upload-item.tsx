"use client";

import { FileIcon, Loader2, X } from "lucide-react";
import { Button, Progress } from "@/shared/ui";
import type { UploadingFile } from "@/entities/file";

interface UploadItemProps {
  item: UploadingFile;
  onRemove: () => void;
}

export function UploadItem({ item, onRemove }: UploadItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <FileIcon className="h-8 w-8 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium">{item.file.name}</p>
        {item.status === "uploading" && (
          <Progress value={item.progress} className="mt-1 h-1" />
        )}
        {item.status === "error" && (
          <p className="text-xs text-destructive">{item.error}</p>
        )}
        {item.status === "complete" && (
          <p className="text-xs text-green-600">Upload complete</p>
        )}
      </div>
      {item.status === "uploading" ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Button variant="ghost" size="icon" onClick={onRemove}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
