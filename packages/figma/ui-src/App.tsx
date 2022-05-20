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
    const html: string = msg.data;
    htmlToCopy = html;
    document.execCommand("copy");

    postMesssageToPlugin({
      type: "notify",
      data: "Copied to clipboard",
    });
  }
});

function postMesssageToPlugin(data: MessageToPlugin): void {
  parent.postMessage({ pluginMessage: data }, "*");
}

function App() {
  const onCopy = () => {
    postMesssageToPlugin({ type: "copy" });
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
