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

  console.log(Project.instance.fileServer?.port);

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "macaron-vscode" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "macaron-vscode.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      void vscode.window.showInformationMessage(
        "Hello World from macaron-vscode!"
      );
    }
  );

  context.subscriptions.push(disposable);

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
export function deactivate(): void {}
