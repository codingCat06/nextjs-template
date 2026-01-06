import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { router, protectedProcedure } from "../init";
import { file } from "@/server/db/schema";
import {
  uploadFile,
  deleteFile,
  getPresignedDownloadUrl,
  getPresignedUploadUrl,
  generateStorageKey,
} from "@/server/storage/r2";

export const filesRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const files = await ctx.db
      .select()
      .from(file)
      .where(eq(file.ownerUserId, ctx.user.id))
      .orderBy(desc(file.createdAt));
    return files;
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .select()
        .from(file)
        .where(and(eq(file.id, input.id), eq(file.ownerUserId, ctx.user.id)));

      if (!result) {
        throw new Error("File not found");
      }

      return result;
    }),

  getUploadUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        contentType: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const storageKey = generateStorageKey(ctx.user.id, input.filename);
      const uploadUrl = await getPresignedUploadUrl(
        storageKey,
        input.contentType
      );
      return { uploadUrl, storageKey };
    }),

  create: protectedProcedure
    .input(
      z.object({
        originalName: z.string(),
        storageKey: z.string(),
        sizeBytes: z.number(),
        mimeType: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const id = crypto.randomUUID();
      await ctx.db.insert(file).values({
        id,
        ownerUserId: ctx.user.id,
        originalName: input.originalName,
        storageKey: input.storageKey,
        sizeBytes: input.sizeBytes,
        mimeType: input.mimeType,
      });
      return { id };
    }),

  upload: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        contentType: z.string(),
        base64Data: z.string(),
        sizeBytes: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const storageKey = generateStorageKey(ctx.user.id, input.filename);
      const buffer = Buffer.from(input.base64Data, "base64");

      await uploadFile(storageKey, buffer, input.contentType);

      const id = crypto.randomUUID();
      await ctx.db.insert(file).values({
        id,
        ownerUserId: ctx.user.id,
        originalName: input.filename,
        storageKey,
        sizeBytes: input.sizeBytes,
        mimeType: input.contentType,
      });

      return { id, storageKey };
    }),

  getDownloadUrl: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .select()
        .from(file)
        .where(and(eq(file.id, input.id), eq(file.ownerUserId, ctx.user.id)));

      if (!result) {
        throw new Error("File not found");
      }

      const downloadUrl = await getPresignedDownloadUrl(result.storageKey);
      return { downloadUrl, filename: result.originalName };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .select()
        .from(file)
        .where(and(eq(file.id, input.id), eq(file.ownerUserId, ctx.user.id)));

      if (!result) {
        throw new Error("File not found");
      }

      await deleteFile(result.storageKey);
      await ctx.db
        .delete(file)
        .where(and(eq(file.id, input.id), eq(file.ownerUserId, ctx.user.id)));

      return { success: true };
    }),
});
