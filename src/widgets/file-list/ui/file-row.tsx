"use client";

import Link from "next/link";
import {
  Download,
  Trash2,
  FileText,
  FileImage,
  File,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/shared/ui";
import { formatBytes, formatDate } from "@/shared/lib/utils";
import type { FileItem } from "@/entities/file";

interface FileRowProps {
  file: FileItem;
  isSelected?: boolean;
  onSelect?: () => void;
  onDownload: () => void;
  onDelete: () => void;
  downloadLabel?: string;
  deleteLabel?: string;
  viewLabel?: string;
}

export function FileRow({
  file,
  isSelected,
  onSelect,
  onDownload,
  onDelete,
  downloadLabel = "Download",
  deleteLabel = "Delete",
  viewLabel = "View",
}: FileRowProps) {
  const FileIcon = getFileIcon(file.mimeType);
  const isPdf = file.mimeType === "application/pdf";
  const isClickable = isPdf && onSelect;

  return (
    <div
      className={`flex items-center gap-4 p-4 transition-colors ${
        isClickable ? "cursor-pointer hover:bg-muted/50" : ""
      } ${isSelected ? "bg-muted" : ""}`}
      onClick={() => isPdf && onSelect?.()}
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
          onClick={(e) => {
            e.stopPropagation();
            onDownload();
          }}
        >
          <Download className="mr-2 h-4 w-4" />
          {downloadLabel}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {deleteLabel}
        </Button>
      </div>
    </div>
  );
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) {
    return FileImage;
  }
  if (mimeType === "application/pdf") {
    return FileText;
  }
  return File;
}
