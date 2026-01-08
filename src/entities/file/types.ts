// File domain types

export interface FileMetadata {
  id: string;
  ownerUserId: string;
  originalName: string;
  storageKey: string;
  sizeBytes: number;
  mimeType: string;
  createdAt: Date;
}

// For list displays (subset of FileMetadata)
export interface FileItem {
  id: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: Date | string;
}

// For upload state tracking
export interface UploadingFile {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "complete" | "error";
  error?: string;
}

// For viewing files
export interface ViewingFile {
  id: string;
  name: string;
  url: string;
}
