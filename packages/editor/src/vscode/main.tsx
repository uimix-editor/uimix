import React from "react";
import ReactDOM from "react-dom/client";
import * as Comlink from "comlink";
import { VSCodeApp } from "./VSCodeApp";
import { VSCodeFile } from "./VSCodeFile";
import { API } from "./API";

const vscode = acquireVsCodeApi();

const file = new VSCodeFile();

Comlink.expose(new API(file), {
  addEventListener: window.addEventListener.bind(window),
  removeEventListener: window.removeEventListener.bind(window),
  postMessage: vscode.postMessage.bind(vscode),
});

// TODO: expose Comlink

const rootElem = document.createElement("div");
document.body.append(rootElem);

const root = ReactDOM.createRoot(rootElem);
root.render(
  <React.StrictMode>
    <VSCodeApp file={file} />
  </React.StrictMode>
);
