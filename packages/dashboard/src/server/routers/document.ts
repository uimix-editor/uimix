import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getCurrentUser, authenticate } from "../../helpers/api/auth";
import { db } from "../../lib/prismadb";
import { baseProcedure, router } from "../trpc";

export const documentRouter = router({
  all: baseProcedure.query(async ({ ctx }) => {
    const currentUser = await authenticate(ctx.req);
    const documents = await db.document.findMany({
      where: {
        ownerId: currentUser.id,
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
      throw new Error("test");

      const currentUser = await authenticate(ctx.req);
      const document = await db.document.create({
        data: {
          title: input.title,
          ownerId: currentUser.id,
        },
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
      const document = await db.document.findFirst({
        where: {
          id: input.id,
          ownerId: currentUser.id,
        },
      });
      if (!document) {
        return;
      }
      await db.$transaction([
        db.documentData.deleteMany({
          where: {
            id: input.id,
          },
        }),
        db.document.delete({
          where: {
            id: input.id,
          },
        }),
      ]);
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
      const document = await db.document.findFirst({
        where: {
          id: input.id,
          ownerId: currentUser.id,
        },
      });
      if (!document) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Document not found",
        });
      }
      return await db.document.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
        },
      });
    }),
});
