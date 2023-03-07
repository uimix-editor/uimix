import { router } from "../trpc";
import { collaborativeRouter } from "./collaborative";
import { documentRouter } from "./document";
import { figmaRouter } from "./figma";
import { githubRouter } from "./github";

export const appRouter = router({
  figma: figmaRouter,
  github: githubRouter,
  document: documentRouter,
  collaborative: collaborativeRouter,
});

export type AppRouter = typeof appRouter;
