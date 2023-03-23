import React from "react";
import ReactDOM from "react-dom/client";
import { ForeignComponentManager } from "../models/ForeignComponentManager";
import { projectState } from "../state/ProjectState";
import { nodePicker } from "../views/viewport/renderer/NodePicker";
import { ScreenshotTaker } from "./ScreenshotTaker";
import { ScreenshotDataConnector } from "./ScreenshotTakerDataConnector";
//import "./index.css";

nodePicker.document = window.document;
ForeignComponentManager.init(window);

new ScreenshotDataConnector(projectState);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ScreenshotTaker />
  </React.StrictMode>
);
