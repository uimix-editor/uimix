import { Target } from "./index";

export function iframeTarget(iframe: HTMLIFrameElement): Target {
  return {
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
  };
}

export function parentWindowTarget(): Target {
  return {
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
  };
}
