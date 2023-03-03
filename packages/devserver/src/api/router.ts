import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { Context } from "./context";
import { observable } from "@trpc/server/observable";
import { ProjectJSON } from "@uimix/node-data";
import { ProjectController } from "../controller/ProjectController.js";
import { ImageEntry } from "../types.js";

export function createAppRouter({
  projectController,
}: {
  projectController: ProjectController;
}) {
  const t = initTRPC.context<Context>().create();

  return t.router({
    hello: t.procedure
      .input(
        z.object({
          name: z.string(),
        })
      )
      .query((req) => {
        const { input } = req;
        return `Hello ${input.name}`;
      }),

    onChange: t.procedure.subscription(() => {
      return observable<ProjectJSON>((emit) =>
        projectController.onChange((data) => emit.next(data))
      );
    }),

    save: t.procedure
      .input(
        z.object({
          project: ProjectJSON,
        })
      )
      .mutation(async (req) => {
        await projectController.save(req.input.project);
      }),

    load: t.procedure.query(async (req) => {
      return await projectController.load();
    }),

    insertImage: t.procedure
      .input(
        z.object({
          entry: ImageEntry,
        })
      )
      .mutation(async (req) => {
        await projectController.insertImage(req.input.entry);
      }),

    onImageAdded: t.procedure.subscription(() => {
      return observable<ImageEntry>((emit) =>
        projectController.onImageAdded((entry) => emit.next(entry))
      );
    }),
  });
}

export type AppRouter = ReturnType<typeof createAppRouter>;
