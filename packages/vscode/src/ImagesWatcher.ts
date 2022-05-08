import * as path from "path";
import * as vscode from "vscode";
import { globby, isGitIgnored } from "globby";

export class ImagesWatcher {
  constructor(rootUri: vscode.Uri) {
    this.rootUri = rootUri;
    void this.load();
  }

  readonly rootUri: vscode.Uri;

  readonly paths = new Set<string>();

  private readonly _onChange = new vscode.EventEmitter<Set<string>>();
  get onChange(): vscode.Event<Set<string>> {
    return this._onChange.event;
  }

  private async load() {
    const isIgnored = await isGitIgnored({ cwd: this.rootUri.path });

    const filePattern = new vscode.RelativePattern(
      this.rootUri,
      "**/*.{png,jpg,jpeg,gif,svg}"
    );

    const fileWatcher = vscode.workspace.createFileSystemWatcher(filePattern);
    fileWatcher.onDidCreate(async (uri) => {
      const relPath = path.relative(this.rootUri.path, uri.path);
      if (isIgnored(relPath)) {
        return;
      }
      this.paths.add(uri.path);
      this._onChange.fire(this.paths);
    });
    fileWatcher.onDidDelete((uri) => {
      const relPath = path.relative(this.rootUri.path, uri.path);
      if (isIgnored(relPath)) {
        return;
      }
      this.paths.delete(uri.path);
      this._onChange.fire(this.paths);
    });

    const paths = await globby("**/*.{png,jpg,jpeg,gif,svg}", {
      cwd: this.rootUri.path,
      gitignore: true,
    });

    for (const filePath of paths) {
      const absPath = path.join(this.rootUri.path, filePath);
      this.paths.add(absPath);
    }
    this._onChange.fire(this.paths);

    vscode.workspace.onWillRenameFiles((event) => {
      const imageFiles = event.files.filter((f) =>
        f.oldUri.path.match(/\.(png|jpg|jpeg|gif|svg)$/i)
      );
      if (imageFiles.length) {
        event.waitUntil(this.rename(imageFiles));
      }
    });
  }

  private async rename(
    imageFiles: {
      oldUri: vscode.Uri;
      newUri: vscode.Uri;
    }[]
  ) {
    // TODO: rename usages in documents
    // const macaronFiles = await vscode.workspace.findFiles(
    //   new vscode.RelativePattern(this.rootUri, "**/*.{macaron}")
    // );
    // for (const file of macaronFiles) {
    //   const document = await vscode.workspace.openTextDocument(file);
    //   const pageJSON = parsePageJSON(document.getText(), document.uri.path);
    //   const pathMap = new Map<string, string>(
    //     imageFiles.map((change) => [
    //       getImportPath(document.uri.path, change.oldUri.path),
    //       getImportPath(document.uri.path, change.newUri.path),
    //     ])
    //   );
    //   const newPageJSON = PageJSON.replace(pageJSON, {
    //     imageURL: (path) => pathMap.get(path) ?? path,
    //   });
    //   if (!isEqual(pageJSON, newPageJSON)) {
    //     const edit = createEditFromLineDiffs(
    //       document,
    //       toFormattedJSON(newPageJSON)
    //     );
    //     await vscode.workspace.applyEdit(edit);
    //   }
    // }
  }
}
