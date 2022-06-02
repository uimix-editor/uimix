import React from "react";
import ReactDOM from "react-dom/client";
import { StyleSheetManager } from "styled-components";
import {
  ColorSchemeProvider,
  GlobalStyle,
  PaintkitProvider,
} from "@seanchas116/paintkit/src/components/GlobalStyle";
import { ContextMenuProvider } from "@seanchas116/paintkit/src/components/menu/ContextMenuProvider";
import { JSONUndoHistory } from "@seanchas116/paintkit/src/util/JSONUndoHistory";
import { DocumentJSON, Document } from "../models/Document";
import { EditorState } from "../state/EditorState";
import { Editor } from "../views/Editor";

class EditorElementEditorState extends EditorState {
  readonly history = new JSONUndoHistory<DocumentJSON, Document>(
    new Document()
  );
}

const App: React.FC<{
  editorState: EditorState;
}> = ({ editorState }) => {
  return (
    <ColorSchemeProvider colorScheme="auto">
      <GlobalStyle />
      <PaintkitProvider>
        <ContextMenuProvider>
          <Editor editorState={editorState} />
        </ContextMenuProvider>
      </PaintkitProvider>
    </ColorSchemeProvider>
  );
};

export class MacaronEditorElement extends HTMLElement {
  private _editorState: EditorElementEditorState;

  constructor() {
    super();
    this._editorState = new EditorElementEditorState();
  }

  connectedCallback(): void {
    const shadowRoot = this.attachShadow({ mode: "open" });
    const styles = document.createElement("div");
    shadowRoot.append(styles);

    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: block;
      }
    `;
    styles.appendChild(style);

    const mountPoint = document.createElement("span");
    shadowRoot.appendChild(mountPoint);

    const root = ReactDOM.createRoot(mountPoint);
    root.render(
      <React.StrictMode>
        <StyleSheetManager target={styles}>
          <App editorState={this._editorState} />
        </StyleSheetManager>
      </React.StrictMode>
    );
  }

  get editorState(): EditorElementEditorState {
    return this._editorState;
  }
}

customElements.define("macaron-editor", MacaronEditorElement);
