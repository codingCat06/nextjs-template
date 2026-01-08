import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { router, adminProcedure } from "../init";
import { user } from "@/server/db/schema/index";

export const adminRouter = router({
  getUsers: adminProcedure.query(async ({ ctx }) => {
    const users = await ctx.db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      .from(user)
      .orderBy(desc(user.createdAt));
    return users;
  }),

  getUserById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })
        .from(user)
        .where(eq(user.id, input.id));

      if (!result) {
        throw new Error("User not found");
      }

      return result;
    }),

  setUserActiveStatus: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        isActive: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Prevent admin from disabling themselves
      if (input.userId === ctx.user.id && !input.isActive) {
        throw new Error("Cannot disable your own account");
      }

      await ctx.db
        .update(user)
        .set({ isActive: input.isActive })
        .where(eq(user.id, input.userId));

      return { success: true };
    }),

  setUserRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["user", "admin"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Prevent admin from demoting themselves
      if (input.userId === ctx.user.id && input.role !== "admin") {
        throw new Error("Cannot change your own role");
      }

      await ctx.db
        .update(user)
        .set({ role: input.role })
        .where(eq(user.id, input.userId));

      return { success: true };
    }),
});
