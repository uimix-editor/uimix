import { User } from "@prisma/client";
import { GetServerSidePropsContext, NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { db } from "../../lib/prismadb";

export async function getAccountToken(
  req: GetServerSidePropsContext["req"] | NextRequest | NextApiRequest,
  provider: "github" | "figma"
): Promise<string | undefined> {
  const token = await getToken({
    req,
  });
  if (!token) {
    return;
  }

  const account = await db.account.findFirst({
    where: {
      userId: token.sub,
      provider,
    },
  });

  return account?.access_token ?? undefined;
}

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
