import { Server } from "@hocuspocus/server";
import { Logger } from "@hocuspocus/extension-logger";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

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
  extensions: [new Logger()],
  // async getDocumentName({ documentName, requestParameters }) {
  //   return `${documentName}-${requestParameters.get('prefix')}`
  // },

  async onAuthenticate(data) {
    // TODO:
    // - issue a JWT token in dashboard
    // - use that token to authenticate here

    const userInfo = decodeToken(data.token);
    if (!userInfo) {
      throw new Error("Invalid token");
    }
    console.log("authenticated user", userInfo.userId);

    const document = await db.document.findUnique({
      where: {
        id: data.documentName,
      },
    });
    if (!document || document.ownerId !== userInfo.userId) {
      throw new Error("Document not found");
    }
    console.log(document);
  },

  // Test error handling
  // async onConnect(data) {
  //   throw new Error('CRASH')
  // },

  // async onConnect(data) {
  //   await new Promise((resolve, reject) => setTimeout(() => {
  //     // @ts-ignore
  //     reject()
  //   }, 1337))
  // },

  // async onConnect(data) {
  //   await new Promise((resolve, reject) => setTimeout(() => {
  //     // @ts-ignore
  //     resolve()
  //   }, 1337))
  // },

  // Intercept HTTP requests
  // onRequest(data) {
  //   return new Promise((resolve, reject) => {
  //     const { response } = data
  //     // Respond with your custum content
  //     response.writeHead(200, { 'Content-Type': 'text/plain' })
  //     response.end('This is my custom response, yay!')

  //     // Rejecting the promise will stop the chain and no further
  //     // onRequest hooks are run
  //     return reject()
  //   })
  // },
});

server.listen();
