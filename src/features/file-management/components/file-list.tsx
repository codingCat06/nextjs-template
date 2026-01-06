"use client";

import { useState } from "react";
import { Download, Trash2, FileText, FileImage, File, Loader2, Eye, X } from "lucide-react";
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
import { PdfViewer } from "./pdf-viewer";

interface FileListProps {
  downloadLabel?: string;
  deleteLabel?: string;
  viewLabel?: string;
  onDownload?: (fileId: string) => void;
  onDelete?: (fileId: string) => void;
}

interface ViewingFile {
  id: string;
  name: string;
  url: string;
}

export function FileList({
  downloadLabel = "Download",
  deleteLabel = "Delete",
  viewLabel = "View",
}: FileListProps) {
  const [deleteFileId, setDeleteFileId] = useState<string | null>(null);
  const [viewingFile, setViewingFile] = useState<ViewingFile | null>(null);

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

  const handleDownload = (fileId: string) => {
    // Use proxy API with download flag
    const link = document.createElement("a");
    link.href = `/api/files/${fileId}?download=true`;
    link.click();
  };

  const handleView = (fileId: string, fileName: string) => {
    // Use proxy API to avoid CORS issues with R2
    setViewingFile({
      id: fileId,
      name: fileName,
      url: `/api/files/${fileId}`,
    });
  };

  const closeViewer = () => {
    setViewingFile(null);
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
        {files.map((file) => {
          const FileIcon = getFileIcon(file.mimeType);
          const isPdf = file.mimeType === "application/pdf";

          return (
            <div
              key={file.id}
              className="flex items-center gap-4 p-4 hover:bg-muted/50"
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
                    onClick={() => handleView(file.id, file.originalName)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    {viewLabel}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(file.id)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {downloadLabel}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteFileId(file.id)}
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

      {/* PDF Viewer Section */}
      {viewingFile && (
        <div className="mt-6 rounded-lg border bg-card">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="truncate font-semibold">{viewingFile.name}</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(viewingFile.id)}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="ghost" size="icon" onClick={closeViewer}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          {/* PDF Viewer */}
          <div className="p-4">
            <PdfViewer url={viewingFile.url} />
          </div>
        </div>
      )}
    </>
  );
}
