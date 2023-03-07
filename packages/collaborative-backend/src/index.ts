import { Server } from "@hocuspocus/server";
import { Logger } from "@hocuspocus/extension-logger";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient({
  log: ["query"],
});

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

    if (data.token !== "my-access-token") {
      throw new Error("Incorrect access token");
    }

    console.log(await db.document.findMany());
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
