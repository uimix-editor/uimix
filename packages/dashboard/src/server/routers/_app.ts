import { router } from "../trpc";
import { figmaRouter } from "./figma";
import { githubRouter } from "./github";

export const appRouter = router({
  figma: figmaRouter,
  github: githubRouter,
});

export type AppRouter = typeof appRouter;
