import React from "react";
import ReactDOM from "react-dom/client";
import { VSCodeApp } from "./VSCodeApp";
import { VSCodeAppState } from "./VSCodeAppState";

const appState = new VSCodeAppState();

const rootElem = document.createElement("div");
document.body.append(rootElem);

const root = ReactDOM.createRoot(rootElem);
root.render(
  <React.StrictMode>
    <VSCodeApp appState={appState} />
  </React.StrictMode>
);
