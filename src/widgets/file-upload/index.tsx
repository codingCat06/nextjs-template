"use client";

import { useDropzone } from "react-dropzone";
import { Button } from "@/shared/ui";
import { useFileUpload } from "@/features/file-upload";
import { Dropzone } from "./ui/dropzone";
import { UploadItem } from "./ui/upload-item";

interface FileUploadProps {
  onUploadComplete?: () => void;
  maxSizeBytes?: number;
  acceptedTypes?: string[];
}

export function FileUpload({
  onUploadComplete,
  maxSizeBytes = 50 * 1024 * 1024, // 50MB default
  acceptedTypes,
}: FileUploadProps) {
  const {
    uploadingFiles,
    handleFiles,
    removeFile,
    clearCompleted,
    hasCompleted,
  } = useFileUpload({ maxSizeBytes, onUploadComplete });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFiles,
    accept: acceptedTypes
      ? acceptedTypes.reduce(
          (acc, type) => ({ ...acc, [type]: [] }),
          {} as Record<string, string[]>
        )
      : undefined,
  });

  return (
    <div className="space-y-4">
      <Dropzone
        isDragActive={isDragActive}
        maxSizeBytes={maxSizeBytes}
        getRootProps={getRootProps}
        getInputProps={getInputProps}
      />

      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              Uploading {uploadingFiles.length} file(s)
            </p>
            {hasCompleted && (
              <Button variant="ghost" size="sm" onClick={clearCompleted}>
                Clear completed
              </Button>
            )}
          </div>
          {uploadingFiles.map((item, index) => (
            <UploadItem
              key={index}
              item={item}
              onRemove={() => removeFile(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
