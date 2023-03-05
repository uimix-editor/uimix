import { router } from "../trpc";
import { documentRouter } from "./document";
import { figmaRouter } from "./figma";
import { githubRouter } from "./github";

export const appRouter = router({
  figma: figmaRouter,
  github: githubRouter,
  document: documentRouter,
});

export type AppRouter = typeof appRouter;
