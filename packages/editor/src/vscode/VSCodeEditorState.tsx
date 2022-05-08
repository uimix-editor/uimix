import { JSONUndoHistory } from "@seanchas116/paintkit/src/util/JSONUndoHistory";
import { DocumentJSON, Document } from "../models/Document";
import { EditorState } from "../state/EditorState";
import { VSCodeAppState } from "./VSCodeAppState";

export class VSCodeEditorState extends EditorState {
  constructor(appState: VSCodeAppState) {
    super();
    this.appState = appState;
  }

  readonly appState: VSCodeAppState;

  get history(): JSONUndoHistory<DocumentJSON, Document> {
    return this.appState.file.history;
  }

  get imageAssets(): readonly string[] {
    return this.appState.imageAssets;
  }

  resolveImageAssetURL(assetPath: string): string {
    return this.appState.resolveImageAssetURL(assetPath);
  }
}
