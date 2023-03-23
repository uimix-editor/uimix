import React from "react";
import ReactDOM from "react-dom/client";
import { ForeignComponentManager } from "../models/ForeignComponentManager";
import { nodePicker } from "../views/viewport/renderer/NodePicker";
import { ScreenshotTaker } from "./ScreenshotTaker";
//import "./index.css";

nodePicker.document = window.document;
ForeignComponentManager.init(window);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ScreenshotTaker />
  </React.StrictMode>
);
