import { Buffer } from "buffer";
import { MessageToCode, MessageToUI } from "./message";
import "./ui.css";

function postPluginMessage(pluginMessage: MessageToCode): void {
  parent.postMessage({ pluginMessage }, "*");
}

document.addEventListener("DOMContentLoaded", () => {
  const clipboardArea = document.getElementById("clipboard-area")!;

  document.getElementById("copy")!.onclick = () => {
    postPluginMessage({ type: "copy-nodes" });
  };

  document.getElementById("paste")!.onclick = () => {
    clipboardArea.innerHTML = "";

    const range = document.createRange();
    range.selectNodeContents(clipboardArea);
    const sel = window.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);

    document.execCommand("paste");

    const span = clipboardArea.querySelector("[data-macaron-clipboard]");
    if (!span) {
      return;
    }

    const data = Buffer.from(
      span.getAttribute("data-macaron-clipboard") ?? "",
      "base64"
    ).toString();

    postPluginMessage({ type: "paste-nodes", data });
  };

  window.addEventListener("message", (e) => {
    const msg = e.data.pluginMessage as MessageToUI;

    switch (msg.type) {
      case "copy-data": {
        clipboardArea.innerHTML = "";

        clipboardArea.append("text");

        const span = document.createElement("span");

        // TODO msg.json to base64
        span.setAttribute(
          "data-macaron-clipboard",
          Buffer.from(msg.data).toString("base64")
        );
        span.innerText = "text";
        clipboardArea.append(span);

        clipboardArea.append("text");

        const range = document.createRange();
        range.selectNodeContents(clipboardArea);
        const sel = window.getSelection()!;
        sel.removeAllRanges();
        sel.addRange(range);

        document.execCommand("copy");

        postPluginMessage({
          type: "notify",
          message: "Copied layers to clipboard. Paste in Macaron",
        });

        break;
      }
    }
  });
});
