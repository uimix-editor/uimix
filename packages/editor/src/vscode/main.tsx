import React from "react";
import ReactDOM from "react-dom/client";
import { VSCodeApp } from "./VSCodeApp";
import { VSCodeFile } from "./VSCodeFile";

const file = new VSCodeFile();

// TODO: expose Comlink

const rootElem = document.createElement("div");
document.body.append(rootElem);

const root = ReactDOM.createRoot(rootElem);
root.render(
  <React.StrictMode>
    <VSCodeApp file={file} />
  </React.StrictMode>
);
