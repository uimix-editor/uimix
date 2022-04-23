import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";
import { Document, DocumentJSON } from "./models/Document";
// eslint-disable-next-line import/order
import { JSONUndoHistory } from "@seanchas116/paintkit/src/util/JSONUndoHistory";

const doc = new Document();
const history = new JSONUndoHistory<DocumentJSON, Document>(doc);

const rootElem = document.createElement("div");
document.body.append(rootElem);

let root = ReactDOM.createRoot(rootElem);
root.render(
  <React.StrictMode>
    <App history={history} />
  </React.StrictMode>
);

if (module.hot) {
  module.hot.accept("./App", async () => {
    root.unmount();
    root = ReactDOM.createRoot(rootElem);

    const NextApp = (await import("./App")).App;
    root.render(
      <React.StrictMode>
        <NextApp history={history} />
      </React.StrictMode>
    );
  });
}
