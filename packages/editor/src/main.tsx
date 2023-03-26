import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./views/App";
import "./index.css";
import { IFrameDataConnector } from "./state/IFrameDataConnector";
import { projectState } from "./state/ProjectState";

if (window.parent !== window) {
  new IFrameDataConnector(projectState);
} else {
  projectState.setupInitContent();
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
