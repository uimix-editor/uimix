import React, { useRef } from "react";
import logoPng from "./logo.png";
import logoSvg from "./logo.svg?raw";
import Logo from "./Logo";
import "./App.css";

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
