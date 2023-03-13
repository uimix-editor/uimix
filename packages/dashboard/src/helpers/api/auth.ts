import { User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { GetServerSidePropsContext, NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { db } from "../../lib/prismadb";

export async function getCurrentUser(
  req:
    | GetServerSidePropsContext["req"]
    | NextRequest
    | NextApiRequest
    | undefined
): Promise<User | undefined> {
  if (!req) {
    return;
  }

  const token = await getToken({
    req,
  });
  if (!token) {
    return;
  }

  return (
    (await db.user.findFirst({
      where: {
        id: token.sub,
      },
    })) ?? undefined
  );
}

export async function authenticate(
  req:
    | GetServerSidePropsContext["req"]
    | NextRequest
    | NextApiRequest
    | undefined
): Promise<User> {
  const currentUser = await getCurrentUser(req);

  if (!currentUser) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
  }

  return currentUser;
}
