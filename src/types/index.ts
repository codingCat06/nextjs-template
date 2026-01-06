export type UserRole = "user" | "admin";

export interface FileMetadata {
  id: string;
  ownerUserId: string;
  originalName: string;
  storageKey: string;
  sizeBytes: number;
  mimeType: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
