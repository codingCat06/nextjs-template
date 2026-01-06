import { router } from "../init";
import { filesRouter } from "./files";
import { adminRouter } from "./admin";

export const appRouter = router({
  files: filesRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
