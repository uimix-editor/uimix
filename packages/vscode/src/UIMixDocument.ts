import * as vscode from "vscode";

export class UIMixDocument implements vscode.CustomDocument {
  constructor(uri: vscode.Uri) {
    this.uri = uri;
  }

  readonly uri: vscode.Uri;

  dispose(): void {}
}
