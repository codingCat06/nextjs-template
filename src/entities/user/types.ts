// User domain types

export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  image?: string | null;
}

// For list displays (from tRPC response - dates come as strings)
export interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// For user actions
export interface UserActionPayload {
  userId: string;
  userName: string;
}
