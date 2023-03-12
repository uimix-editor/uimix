import { router } from "../trpc";
import { collaborativeRouter } from "./collaborative";
import { documentRouter } from "./document";
import { figmaRouter } from "./figma";
import { githubRouter } from "./github";
import { imageRouter } from "./image";

export const appRouter = router({
  figma: figmaRouter,
  github: githubRouter,
  document: documentRouter,
  collaborative: collaborativeRouter,
  image: imageRouter,
});

export type AppRouter = typeof appRouter;
