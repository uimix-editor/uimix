import { initTRPC } from "@trpc/server";
import { Context } from "./context";

const t = initTRPC.context<Context>().create({
  //transformer: superjson,
});

export const router = t.router;
export const baseProcedure = t.procedure;
