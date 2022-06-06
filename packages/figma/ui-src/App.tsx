import React, { useRef } from "react";
import "./App.css";
import { MessageToPlugin, MessageToUI } from "../message";

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
    const base64 = btoa(fragmentString);
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

function App() {
  const onCopy = () => {
    postMessageToPlugin({ type: "copy" });
  };

  return (
    <main>
      <header>
        <h2>Figma to Macaron</h2>
      </header>
      <footer>
        <button className="brand" onClick={onCopy}>
          Copy
        </button>
      </footer>
    </main>
  );
}

export default App;
