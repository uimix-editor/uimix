import { router } from "../trpc";
import { collaborativeRouter } from "./collaborative";
import { documentRouter } from "./document";
import { imageRouter } from "./image";

export const appRouter = router({
  document: documentRouter,
  collaborative: collaborativeRouter,
  image: imageRouter,
});

export type AppRouter = typeof appRouter;
