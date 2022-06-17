import "./ui.macaron";
import { MessageToPlugin, MessageToUI } from "../message";
import { Buffer } from "buffer";

const ui = document.querySelector("macaron-figma-ui")!;
const copyButtonElement = ui.shadowRoot!.querySelector(
  "#copy-button"
)! as HTMLElement;
const selectionCountElement = ui.shadowRoot!.querySelector(
  "#selection-count"
)! as HTMLElement;

copyButtonElement.addEventListener("click", onCopy);

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
  } else if (msg.type === "selectionChange") {
    if (msg.count === 0) {
      copyButtonElement.ariaDisabled = "true";
      selectionCountElement.innerText = "No layers selected";
    } else {
      copyButtonElement.ariaDisabled = "false";
      if (msg.count === 1) {
        selectionCountElement.innerText = "1 layer selected";
      } else if (msg.count > 1) {
        selectionCountElement.innerText = `${msg.count} layers selected`;
      }
    }
  }
});

function postMessageToPlugin(data: MessageToPlugin): void {
  parent.postMessage({ pluginMessage: data }, "*");
}

function onCopy(): void {
  if (copyButtonElement.ariaDisabled === "true") {
    return;
  }
  postMessageToPlugin({ type: "copy" });
}
