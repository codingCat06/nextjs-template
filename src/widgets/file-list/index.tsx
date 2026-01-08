"use client";

import { useState } from "react";
import { Loader2, File } from "lucide-react";
import { trpc } from "@/shared/lib/trpc";
import type { FileItem } from "@/entities/file";
import { FileRow } from "./ui/file-row";
import { DeleteDialog } from "./ui/delete-dialog";

interface FileListProps {
  onSelect?: (file: FileItem) => void;
  selectedFileId?: string;
  downloadLabel?: string;
  deleteLabel?: string;
  viewLabel?: string;
}

export function FileList({
  onSelect,
  selectedFileId,
  downloadLabel = "Download",
  deleteLabel = "Delete",
  viewLabel = "View",
}: FileListProps) {
  const [deleteFileId, setDeleteFileId] = useState<string | null>(null);

  const { data: files, isLoading } = trpc.files.list.useQuery();
  const utils = trpc.useUtils();

  const deleteMutation = trpc.files.delete.useMutation({
    onSuccess: () => {
      utils.files.list.invalidate();
      setDeleteFileId(null);
    },
  });

  const handleDownload = (fileId: string) => {
    const link = document.createElement("a");
    link.href = `/api/files/${fileId}?download=true`;
    link.click();
  };

  const handleDelete = async () => {
    if (!deleteFileId) return;
    await deleteMutation.mutateAsync({ id: deleteFileId });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!files || files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
        <File className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">No files uploaded yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="divide-y rounded-lg border">
        {files.map((file) => (
          <FileRow
            key={file.id}
            file={file}
            isSelected={selectedFileId === file.id}
            onSelect={() => onSelect?.(file)}
            onDownload={() => handleDownload(file.id)}
            onDelete={() => setDeleteFileId(file.id)}
            downloadLabel={downloadLabel}
            deleteLabel={deleteLabel}
            viewLabel={viewLabel}
          />
        ))}
      </div>

      <DeleteDialog
        open={!!deleteFileId}
        onOpenChange={(open) => !open && setDeleteFileId(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </>
  );
}

export type { FileItem };
