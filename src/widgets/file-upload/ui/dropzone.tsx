"use client";

import { Upload } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface DropzoneProps {
  isDragActive: boolean;
  maxSizeBytes: number;
  getRootProps: () => Record<string, unknown>;
  getInputProps: () => Record<string, unknown>;
}

export function Dropzone({
  isDragActive,
  maxSizeBytes,
  getRootProps,
  getInputProps,
}: DropzoneProps) {
  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50"
      )}
    >
      <input {...getInputProps()} />
      <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
      {isDragActive ? (
        <p className="text-center text-muted-foreground">
          Drop the files here...
        </p>
      ) : (
        <div className="text-center">
          <p className="text-muted-foreground">
            Drag & drop files here, or click to select
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Max file size: {Math.round(maxSizeBytes / 1024 / 1024)}MB
          </p>
        </div>
      )}
    </div>
  );
}
