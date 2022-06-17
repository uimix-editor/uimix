/// <reference types="vite/client" />

import "../util/nodeGlobalsPolyfill";

import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { File } from "./File";

const file = new File();

window.addEventListener("beforeunload", (e) => {
  e.preventDefault();

  if (file.history.isModified) {
    return (e.returnValue = "Are you sure you want to exit?");
  }
});

const rootElem = document.createElement("div");
document.body.append(rootElem);

let root = ReactDOM.createRoot(rootElem);
root.render(
  <React.StrictMode>
    <App file={file} />
  </React.StrictMode>
);

if (import.meta.hot) {
  import.meta.hot.accept("./App", async () => {
    root.unmount();
    root = ReactDOM.createRoot(rootElem);

    const NextApp = (await import("./App")).App;
    root.render(
      <React.StrictMode>
        <NextApp file={file} />
      </React.StrictMode>
    );
  });
}
