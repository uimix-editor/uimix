import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getCurrentUser } from "../../helpers/api/auth";
import { db } from "../../lib/prismadb";
import { baseProcedure, router } from "../trpc";

export const documentRouter = router({
  all: baseProcedure.query(async ({ ctx }) => {
    const currentUser = await getCurrentUser(ctx.req);

    if (!currentUser) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }

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
      const currentUser = await getCurrentUser(ctx.req);

      if (!currentUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }

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
      const currentUser = await getCurrentUser(ctx.req);

      if (!currentUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }

      const document = await db.document.findFirst({
        where: {
          id: input.id,
          ownerId: currentUser.id,
        },
      });

      return document ?? undefined;
    }),
});
