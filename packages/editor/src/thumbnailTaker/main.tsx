import React from "react";
import ReactDOM from "react-dom/client";
import { ForeignComponentManager } from "../models/ForeignComponentManager";
import { projectState } from "../state/ProjectState";
import { nodePicker } from "../views/viewport/renderer/NodePicker";
import { ThumbnailTaker } from "./ThumbnailTaker";
import { ThumbnailTakerDataConnector } from "./ThumbnailTakerDataConnector";
//import "./index.css";

nodePicker.document = window.document;
ForeignComponentManager.init(window);

new ThumbnailTakerDataConnector(projectState);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThumbnailTaker />
  </React.StrictMode>
);
