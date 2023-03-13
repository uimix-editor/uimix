import { TRPCError } from "@trpc/server";
import { getCurrentUser } from "../../helpers/api/auth";
import { baseProcedure, router } from "../trpc";
import jwt from "jsonwebtoken";

export const collaborativeRouter = router({
  token: baseProcedure.query(async ({ ctx }) => {
    const currentUser = await getCurrentUser(ctx.req);

    if (!currentUser) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }

    const token = jwt.sign(
      { userId: currentUser.id },
      process.env.COLLABORATIVE_TOKEN_SECRET as string
    );

    return token;
  }),
});
