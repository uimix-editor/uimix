import React from "react";
import ReactDOM from "react-dom/client";
import * as Comlink from "comlink";
import { IExtensionAPI } from "../../../vscode/src/APIInterface";
import { VSCodeApp } from "./VSCodeApp";
import { VSCodeFile } from "./VSCodeFile";
import { API } from "./API";

const vscode = acquireVsCodeApi();

const file = new VSCodeFile();

const comlinkEndpoint: Comlink.Endpoint = {
  addEventListener: window.addEventListener.bind(window),
  removeEventListener: window.removeEventListener.bind(window),
  postMessage: (message: unknown) => {
    console.log(message);
    vscode.postMessage(message);
  },
};

Comlink.expose(new API(file), comlinkEndpoint);

const extensionAPI = Comlink.wrap<IExtensionAPI>(comlinkEndpoint);
file.onDirtyChange((dirty) => extensionAPI.onDirtyChange(dirty));

const rootElem = document.createElement("div");
document.body.append(rootElem);

const root = ReactDOM.createRoot(rootElem);
root.render(
  <React.StrictMode>
    <VSCodeApp file={file} />
  </React.StrictMode>
);

vscode.postMessage("ready");
