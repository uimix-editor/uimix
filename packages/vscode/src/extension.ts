// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { MacaronEditorProvider } from "./MacaronEditorProvider";
import { Project } from "./Project";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(
  context: vscode.ExtensionContext
): Promise<void> {
  await Project.instance.fileServer?.listen();

  context.subscriptions.push(
    vscode.window.registerCustomEditorProvider(
      "macaron.macaronFile",
      new MacaronEditorProvider(context),
      {
        webviewOptions: {
          retainContextWhenHidden: true,
        },
        supportsMultipleEditorsPerDocument: false,
      }
    )
  );
}

// this method is called when your extension is deactivated
export async function deactivate(): Promise<void> {
  await Project.instance.fileServer?.close();
}
