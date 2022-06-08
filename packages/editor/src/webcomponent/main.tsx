// @ts-ignore
import "tippy.js/dist/tippy.css";

import React from "react";
import ReactDOM from "react-dom/client";
import styled, { StyleSheetManager } from "styled-components";
import { PaintkitRoot } from "@seanchas116/paintkit/src/components/PaintkitRoot";
import { JSONUndoHistory } from "@seanchas116/paintkit/src/util/JSONUndoHistory";
import { RootPortalHostProvider } from "@seanchas116/paintkit/src/components/RootPortal";
import { action, makeObservable, observable } from "mobx";
import { DocumentJSON, Document } from "../models/Document";
import { EditorState } from "../state/EditorState";
import { Editor } from "../views/Editor";
import { parseDocument, stringifyDocument } from "../fileFormat/document";

class EditorElementEditorState extends EditorState {
  constructor() {
    super();
    makeObservable(this);
  }

  @observable.ref history = new JSONUndoHistory<DocumentJSON, Document>(
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
  static get observedAttributes(): string[] {
    return ["value"];
  }

  constructor() {
    super();
    this._editorState.wheelScrollEnabled = false;
    // this._editorState.layout = "threeColumn";

    this._editorState.history.on("change", () => {
      this._value = stringifyDocument(this._editorState.document);
      const event = new CustomEvent("change");
      this.dispatchEvent(event);
    });
  }
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

  private _value = "";

  get value(): string {
    return this._value;
  }

  @action set value(value: string) {
    if (this._value === value) {
      return;
    }
    this._value = value;
    parseDocument(this._editorState.document, value);
    this._editorState.history.revert(this._editorState.history.snapshot);
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ): void {
    if (name === "value") {
      this.value = newValue;
    }
  }
}

customElements.define("macaron-editor", MacaronEditorElement);
