import { createTRPCProxyClient, createWSClient, wsLink } from "@trpc/client";
import type { AppRouter } from "../../../devserver/src/api/router";

const isLocalhost = location.hostname === "localhost";

function createTrpc() {
  const wsProtocol = location.protocol === "https:" ? "wss" : "ws";

  const wsClient = createWSClient({
    url: `${wsProtocol}://${location.host}/trpc`,
  });

  return createTRPCProxyClient<AppRouter>({
    links: [
      wsLink({
        client: wsClient,
      }),
    ],
  });
}

export const trpc = isLocalhost ? createTrpc() : undefined;
