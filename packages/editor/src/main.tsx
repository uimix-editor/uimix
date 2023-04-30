import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./views/App";
import "./index.css";
import { IFrameDataConnector } from "./state/IFrameDataConnector";
import { projectState } from "./state/ProjectState";
import { viewOptions } from "./state/ViewOptions";

if (viewOptions.type == "demo") {
  projectState.loadDemoFile();
} else {
  new IFrameDataConnector(projectState, viewOptions.type);
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
