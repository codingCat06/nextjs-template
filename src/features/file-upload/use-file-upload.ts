"use client";

import { useState, useCallback } from "react";
import { trpc } from "@/shared/lib/trpc";
import type { UploadingFile } from "@/entities/file";

interface UseFileUploadOptions {
  maxSizeBytes?: number;
  onUploadComplete?: () => void;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const { maxSizeBytes = 50 * 1024 * 1024, onUploadComplete } = options;
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const utils = trpc.useUtils();

  const uploadMutation = trpc.files.upload.useMutation({
    onSuccess: () => {
      utils.files.list.invalidate();
      onUploadComplete?.();
    },
  });

  const uploadFile = useCallback(
    async (file: File, index: number) => {
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
            i === index
              ? { ...f, status: "complete" as const, progress: 100 }
              : f
          )
        );
      } catch (error) {
        setUploadingFiles((prev) =>
          prev.map((f, i) =>
            i === index
              ? {
                  ...f,
                  status: "error" as const,
                  error:
                    error instanceof Error ? error.message : "Upload failed",
                }
              : f
          )
        );
      }
    },
    [uploadMutation]
  );

  const handleFiles = useCallback(
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

      const startIndex = uploadingFiles.length;
      setUploadingFiles((prev) => [...prev, ...newFiles]);

      for (let i = 0; i < validFiles.length; i++) {
        await uploadFile(validFiles[i], startIndex + i);
      }
    },
    [maxSizeBytes, uploadingFiles.length, uploadFile]
  );

  const removeFile = useCallback((index: number) => {
    setUploadingFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearCompleted = useCallback(() => {
    setUploadingFiles((prev) => prev.filter((f) => f.status !== "complete"));
  }, []);

  return {
    uploadingFiles,
    handleFiles,
    removeFile,
    clearCompleted,
    isUploading: uploadingFiles.some((f) => f.status === "uploading"),
    hasCompleted: uploadingFiles.some((f) => f.status === "complete"),
  };
}
