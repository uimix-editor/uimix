import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { authenticate } from "../../helpers/api/auth";
import { db } from "../../lib/prismadb";
import { baseProcedure, router } from "../trpc";

const selectKeys = {
  // exclude data
  id: true,
  title: true,
  ownerId: true,
  updatedAt: true,
  createdAt: true,
} as const;

export const documentRouter = router({
  all: baseProcedure.query(async ({ ctx }) => {
    const currentUser = await authenticate(ctx.req);
    const documents = await db.document.findMany({
      where: {
        ownerId: currentUser.id,
      },
      select: selectKeys,
      orderBy: {
        updatedAt: "desc",
      },
    });

    return documents;
  }),

  create: baseProcedure
    .input(
      z.object({
        title: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // throw new Error("test");

      const currentUser = await authenticate(ctx.req);
      const document = await db.document.create({
        data: {
          title: input.title,
          ownerId: currentUser.id,
        },
        select: selectKeys,
      });

      return document;
    }),

  get: baseProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const currentUser = await authenticate(ctx.req);
      const document = await db.document.findFirst({
        where: {
          id: input.id,
          ownerId: currentUser.id,
        },
        select: selectKeys,
      });

      return document ?? undefined;
    }),

  delete: baseProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentUser = await authenticate(ctx.req);
      await db.document.deleteMany({
        where: {
          id: input.id,
          ownerId: currentUser.id,
        },
      });
    }),

  update: baseProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentUser = await authenticate(ctx.req);
      await db.document.updateMany({
        where: {
          id: input.id,
          ownerId: currentUser.id,
        },
        data: {
          title: input.title,
        },
      });
    }),
});
