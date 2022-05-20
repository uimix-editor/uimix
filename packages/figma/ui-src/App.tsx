import React, { useRef } from "react";
import logoPng from "./logo.png";
import logoSvg from "./logo.svg?raw";
import Logo from "./Logo";
import "./App.css";

let htmlToCopy: string | undefined;

document.addEventListener("copy", (e) => {
  if (htmlToCopy) {
    e.preventDefault();
    e.clipboardData?.setData("text/html", htmlToCopy);
    htmlToCopy = undefined;
  }
});

window.addEventListener("message", (e) => {
  const msg = e.data.pluginMessage;
  if (msg.type === "copy") {
    const html: string = msg.html;
    console.log(html);
    htmlToCopy = html;
    document.execCommand("copy");
  }
});

function App() {
  const onCopy = () => {
    parent.postMessage({ pluginMessage: { type: "copy" } }, "*");
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
