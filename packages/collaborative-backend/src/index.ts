import { Server } from "@hocuspocus/server";
import { Logger } from "@hocuspocus/extension-logger";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { Database } from "@hocuspocus/extension-database";

const db = new PrismaClient({
  log: ["query"],
});

function decodeToken(token: string | undefined):
  | {
      userId: string;
    }
  | undefined {
  if (!token) {
    return;
  }

  try {
    return jwt.verify(
      token,
      process.env.COLLABORATIVE_TOKEN_SECRET as string
    ) as {
      userId: string;
    };
  } catch (err) {
    console.error("error decoding token");
    return;
  }
}

const server = Server.configure({
  port: 1234,
  extensions: [
    new Logger(),
    new Database({
      // Return a Promise to retrieve data …
      fetch: async ({ documentName }) => {
        const data = await db.document.findUnique({
          where: {
            id: documentName,
          },
        });
        return data?.data ?? null;
      },
      // … and a Promise to store data:
      store: async ({ documentName, state }) => {
        await db.document.update({
          where: {
            id: documentName,
          },
          data: {
            data: state,
          },
        });
      },
    }),
  ],

  async onAuthenticate(data) {
    const userInfo = decodeToken(data.token);
    if (!userInfo) {
      throw new Error("Invalid token");
    }
    console.log("authenticated user", userInfo.userId);

    const document = await db.document.findUnique({
      where: {
        id: data.documentName,
      },
      select: {
        ownerId: true,
      },
    });
    if (!document || document.ownerId !== userInfo.userId) {
      throw new Error("Document not found");
    }
    console.log(document);
  },
});

server.listen();
