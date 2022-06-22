import * as path from "path";
import * as vscode from "vscode";

export function getImportPath(from: vscode.Uri, to: vscode.Uri): string {
  const relative = path.posix.relative(path.posix.dirname(from.path), to.path);
  if (!relative.startsWith(".")) {
    return `./${relative}`;
  }
  return relative;
}
