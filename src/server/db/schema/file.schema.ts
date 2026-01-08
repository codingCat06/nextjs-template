import {
  mysqlTable,
  varchar,
  timestamp,
  bigint,
} from "drizzle-orm/mysql-core";
import { user } from "./auth.schema";

// File management table
export const file = mysqlTable("file", {
  id: varchar("id", { length: 36 }).primaryKey(),
  ownerUserId: varchar("owner_user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  storageKey: varchar("storage_key", { length: 512 }).notNull().unique(),
  sizeBytes: bigint("size_bytes", { mode: "number" }).notNull(),
  mimeType: varchar("mime_type", { length: 127 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Type exports
export type File = typeof file.$inferSelect;
export type NewFile = typeof file.$inferInsert;
