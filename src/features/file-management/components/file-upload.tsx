"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileIcon, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/ui/button";
import { Progress } from "@/ui/progress";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onUploadComplete?: () => void;
  maxSizeBytes?: number;
  acceptedTypes?: string[];
}

interface UploadingFile {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "complete" | "error";
  error?: string;
}

export function FileUpload({
  onUploadComplete,
  maxSizeBytes = 50 * 1024 * 1024, // 50MB default
  acceptedTypes,
}: FileUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const utils = trpc.useUtils();

  const uploadMutation = trpc.files.upload.useMutation({
    onSuccess: () => {
      utils.files.list.invalidate();
      onUploadComplete?.();
    },
  });

  const uploadFile = async (file: File, index: number) => {
    setUploadingFiles((prev) =>
      prev.map((f, i) =>
        i === index ? { ...f, status: "uploading" as const, progress: 10 } : f
      )
    );

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(",")[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });

      reader.readAsDataURL(file);

      setUploadingFiles((prev) =>
        prev.map((f, i) => (i === index ? { ...f, progress: 30 } : f))
      );

      const base64Data = await base64Promise;

      setUploadingFiles((prev) =>
        prev.map((f, i) => (i === index ? { ...f, progress: 50 } : f))
      );

      await uploadMutation.mutateAsync({
        filename: file.name,
        contentType: file.type || "application/octet-stream",
        base64Data,
        sizeBytes: file.size,
      });

      setUploadingFiles((prev) =>
        prev.map((f, i) =>
          i === index ? { ...f, status: "complete" as const, progress: 100 } : f
        )
      );
    } catch (error) {
      setUploadingFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? {
                ...f,
                status: "error" as const,
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : f
        )
      );
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const validFiles = acceptedFiles.filter((file) => {
        if (file.size > maxSizeBytes) {
          return false;
        }
        return true;
      });

      const newFiles: UploadingFile[] = validFiles.map((file) => ({
        file,
        progress: 0,
        status: "pending" as const,
      }));

      setUploadingFiles((prev) => [...prev, ...newFiles]);

      const startIndex = uploadingFiles.length;
      for (let i = 0; i < validFiles.length; i++) {
        await uploadFile(validFiles[i], startIndex + i);
      }
    },
    [maxSizeBytes, uploadingFiles.length]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes
      ? acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {})
      : undefined,
  });

  const removeFile = (index: number) => {
    setUploadingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCompleted = () => {
    setUploadingFiles((prev) => prev.filter((f) => f.status !== "complete"));
  };

  return (
    <div className="space-y-4">
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

      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              Uploading {uploadingFiles.length} file(s)
            </p>
            {uploadingFiles.some((f) => f.status === "complete") && (
              <Button variant="ghost" size="sm" onClick={clearCompleted}>
                Clear completed
              </Button>
            )}
          </div>
          {uploadingFiles.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
