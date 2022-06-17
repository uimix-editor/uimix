import "./ui.macaron";
import { MessageToPlugin, MessageToUI } from "../message";
import { Buffer } from "buffer";

let htmlToCopy: string | undefined;

document.addEventListener("copy", (e) => {
  if (htmlToCopy) {
    e.preventDefault();
    e.clipboardData?.setData("text/html", htmlToCopy);
    htmlToCopy = undefined;
  }
});

window.addEventListener("message", (e) => {
  const msg: MessageToUI = e.data.pluginMessage;
  if (msg.type === "copy") {
    const fragmentString: string = msg.data;
    const base64 = Buffer.from(fragmentString).toString("base64");
    const encoded = `<span data-macaron="${base64}"></span>`;
    htmlToCopy = encoded;
    document.execCommand("copy");

    postMessageToPlugin({
      type: "notify",
      data: "Copied to clipboard. Paste in Macaron",
    });
  }
});

function postMessageToPlugin(data: MessageToPlugin): void {
  parent.postMessage({ pluginMessage: data }, "*");
}

const onCopy = () => {
  postMessageToPlugin({ type: "copy" });
};

const ui = document.querySelector("macaron-figma-ui")!;

const copyButton = ui.shadowRoot!.querySelector("#copy-button");

copyButton?.addEventListener("click", onCopy);
