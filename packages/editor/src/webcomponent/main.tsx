// @ts-ignore
import "tippy.js/dist/tippy.css";

import React from "react";
import ReactDOM from "react-dom/client";
import styled, { StyleSheetManager } from "styled-components";
import { PaintkitRoot } from "@seanchas116/paintkit/src/components/PaintkitRoot";
import { JSONUndoHistory } from "@seanchas116/paintkit/src/util/JSONUndoHistory";
import { RootPortalHostProvider } from "@seanchas116/paintkit/src/components/RootPortal";
import { DocumentJSON, Document } from "../models/Document";
import { EditorState } from "../state/EditorState";
import { Editor } from "../views/Editor";

class EditorElementEditorState extends EditorState {
  readonly history = new JSONUndoHistory<DocumentJSON, Document>(
    new Document()
  );
}

const StyledEditor = styled(Editor)`
  width: 100%;
  height: 100%;
`;

const App: React.FC<{
  editorState: EditorState;
}> = ({ editorState }) => {
  return (
    <PaintkitRoot colorScheme="dark">
      <StyledEditor editorState={editorState} />
    </PaintkitRoot>
  );
};

export class MacaronEditorElement extends HTMLElement {
  private _editorState = new EditorElementEditorState();
  private _reactRoot?: ReactDOM.Root;

  connectedCallback(): void {
    this.setAttribute("tabindex", "-1");
    this._editorState.listenKeyEvents(this);

    const shadowRoot = this.attachShadow({ mode: "open" });
    const styles = document.createElement("div");
    shadowRoot.append(styles);

    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: block;
        position: relative;
      }
    `;
    styles.appendChild(style);

    const mountPoint = document.createElement("span");
    shadowRoot.appendChild(mountPoint);

    this._reactRoot = ReactDOM.createRoot(mountPoint);
    this._reactRoot.render(
      <React.StrictMode>
        <RootPortalHostProvider value={shadowRoot}>
          <StyleSheetManager target={styles}>
            <App editorState={this._editorState} />
          </StyleSheetManager>
        </RootPortalHostProvider>
      </React.StrictMode>
    );
  }

  disconnectedCallback(): void {
    this._reactRoot?.unmount();
  }

  get editorState(): EditorElementEditorState {
    return this._editorState;
  }
}

customElements.define("macaron-editor", MacaronEditorElement);
