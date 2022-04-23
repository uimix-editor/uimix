import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { File } from "./File";
import "./index.css";

const file = new File();

const rootElem = document.createElement("div");
document.body.append(rootElem);

let root = ReactDOM.createRoot(rootElem);
root.render(
  <React.StrictMode>
    <App file={file} />
  </React.StrictMode>
);

if (module.hot) {
  module.hot.accept("./App", async () => {
    root.unmount();
    root = ReactDOM.createRoot(rootElem);

    const NextApp = (await import("./App")).App;
    root.render(
      <React.StrictMode>
        <NextApp file={file} />
      </React.StrictMode>
    );
  });
}
