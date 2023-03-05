import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getAccountToken } from "../../helpers/api/auth";
import { baseProcedure, router } from "../trpc";

export const figmaRouter = router({
  file: baseProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      console.log("query");

      const req = ctx.req!;

      const accessToken = await getAccountToken(req, "figma");
      if (!accessToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }

      const fetchRes = await fetch(
        "https://api.figma.com/v1/files/" + input.id,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      );
      if (fetchRes.status === 404) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Not Found",
        });
      }

      const json = await fetchRes.json();
      console.log(json);

      return json;
    }),
});
