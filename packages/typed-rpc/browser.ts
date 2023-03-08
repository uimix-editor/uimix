import { RPC } from "./index";

export function rpcToIFrame<Self, Remote>(
  iframe: HTMLIFrameElement,
  handler: Self
) {
  return new RPC<Self, Remote>({
    post: (message) => iframe.contentWindow?.postMessage(message, "*"),
    subscribe: (handler) => {
      const onMessage = (event: MessageEvent) => {
        if (event.source === iframe.contentWindow) {
          handler(event.data);
        }
      };
      window.addEventListener("message", onMessage);
      return () => {
        window.removeEventListener("message", onMessage);
      };
    },
    handler,
  });
}

export function rpcToParentWindow<Self, Remote>(handler: Self) {
  return new RPC<Self, Remote>({
    post: (message) => window.parent.postMessage(message, "*"),
    subscribe: (handler) => {
      const onMessage = (event: MessageEvent) => {
        if (event.source === window || event.source !== window.parent) {
          return;
        }
        handler(event.data);
      };
      window.addEventListener("message", onMessage);
      return () => {
        window.removeEventListener("message", onMessage);
      };
    },
    handler,
  });
}
