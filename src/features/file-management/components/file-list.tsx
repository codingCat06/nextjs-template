"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Trash2, FileText, FileImage, File, Loader2, ExternalLink } from "lucide-react";
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
import { formatBytes, formatDate } from "@/lib/utils";

export interface FileItem {
  id: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: Date | string;
}

interface FileListProps {
  /** Called when file item is clicked (for inline preview) */
  onSelect?: (file: FileItem) => void;
  /** Currently selected file id (for highlighting) */
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

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return FileImage;
    }
    if (mimeType === "application/pdf") {
      return FileText;
    }
    return File;
  };

  const handleDownload = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = `/api/files/${fileId}?download=true`;
    link.click();
  };

  const handleDelete = async () => {
    if (!deleteFileId) return;
    await deleteMutation.mutateAsync({ id: deleteFileId });
  };

  const handleDeleteClick = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    setDeleteFileId(fileId);
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
        {files.map((file) => {
          const FileIcon = getFileIcon(file.mimeType);
          const isPdf = file.mimeType === "application/pdf";
          const isSelected = selectedFileId === file.id;
          const isClickable = isPdf && onSelect;

          return (
            <div
              key={file.id}
              className={`flex items-center gap-4 p-4 transition-colors ${
                isClickable ? "cursor-pointer hover:bg-muted/50" : ""
              } ${isSelected ? "bg-muted" : ""}`}
              onClick={() => isPdf && onSelect?.(file)}
            >
              <FileIcon className="h-10 w-10 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">{file.originalName}</p>
                <div className="flex gap-3 text-sm text-muted-foreground">
                  <span>{formatBytes(file.sizeBytes)}</span>
                  <span>{formatDate(file.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isPdf && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link href={`/preview/${file.id}`} target="_blank">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {viewLabel}
                    </Link>
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleDownload(e, file.id)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {downloadLabel}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleDeleteClick(e, file.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {deleteLabel}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!deleteFileId} onOpenChange={() => setDeleteFileId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete file</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this file? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteFileId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
