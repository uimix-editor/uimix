import * as vscode from "vscode";
import { WorkspaceIO } from "uimix/src/project/WorkspaceIO";
import { FileAccess, Stats } from "uimix/src/project/FileAccess";
import { ProjectData } from "@uimix/model/src/collaborative";
import * as path from "path";
import { getPageID } from "@uimix/model/src/data/util";
import { codeAssetsDestination } from "uimix/src/codeAssets/constants";

let lastSaveTime = 0;

class VSCodeFileAccess implements FileAccess {
  constructor(rootFolder: vscode.WorkspaceFolder) {
    this.rootFolder = rootFolder;
  }

  readonly rootFolder: vscode.WorkspaceFolder;

  get rootPath() {
    return this.rootFolder.uri.fsPath;
  }

  watch(cwd: string, patterns: string[], onChange: () => void): () => void {
    const watcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(cwd, `**/{${patterns.join(",")},}`)
    );

    const _onChange = () => {
      if (Date.now() - lastSaveTime > 1000) {
        onChange();
      }
    };

    watcher.onDidChange(_onChange);
    watcher.onDidCreate(_onChange);
    watcher.onDidDelete(_onChange);
    return () => watcher.dispose();
  }

  async glob(cwd: string, patterns: string[]): Promise<string[]> {
    const urls = await vscode.workspace.findFiles(
      new vscode.RelativePattern(cwd, `**/{${patterns.join(",")},}`),
      // TODO: configure excludes
      "**/node_modules/**"
    );
    return urls.map((url) => url.fsPath);
  }

  async stat(filePath: string): Promise<Stats | undefined> {
    try {
      const stat = await vscode.workspace.fs.stat(vscode.Uri.file(filePath));
      return {
        type: stat.type & vscode.FileType.Directory ? "directory" : "file",
      };
    } catch (e) {
      return undefined;
    }
  }

  async writeFile(filePath: string, data: Buffer): Promise<void> {
    lastSaveTime = Date.now();

    await vscode.workspace.fs.writeFile(vscode.Uri.file(filePath), data);
  }

  async readFile(filePath: string): Promise<Buffer> {
    const url = vscode.Uri.file(filePath);
    return Buffer.from(await vscode.workspace.fs.readFile(url));
  }

  async remove(filePath: string): Promise<void> {
    // no-op for now (vscode extension doesn't need to delete files)
  }
}

export class WorkspaceAdapter {
  static async load(rootFolder: vscode.WorkspaceFolder) {
    const workspaceIO = new WorkspaceIO(
      new VSCodeFileAccess(rootFolder),
      rootFolder.uri.fsPath
    );
    const result = await workspaceIO.load();
    if (result.problems.length) {
      const message =
        `Error loading workspace:\n` +
        result.problems
          .map((problem) => `${problem.filePath}:\n  ${String(problem.error)}`)
          .join("\n");
      vscode.window.showErrorMessage(message);
    }

    return new WorkspaceAdapter(rootFolder, workspaceIO);
  }

  constructor(rootFolder: vscode.WorkspaceFolder, workspaceIO: WorkspaceIO) {
    this.rootFolder = rootFolder;
    this.workspaceIO = workspaceIO;
    this.disposables.push({
      dispose: workspaceIO.watch(() => {}),
    });

    this.codeAssetsWatcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(
        this.rootFolder,
        `**/${codeAssetsDestination.directory}/{${codeAssetsDestination.js},${codeAssetsDestination.css}}`
      )
    );

    const onChange = (uri: vscode.Uri) => {
      const projectPath = uri.fsPath.replace(
        new RegExp(
          `\\/${codeAssetsDestination.directory.replace(/\//g, "\\/")}.*`
        ),
        ""
      );
      this._onDidChangeCodeAssets.fire(projectPath);
    };
    this.codeAssetsWatcher.onDidCreate(onChange);
    this.codeAssetsWatcher.onDidChange(onChange);
    this.codeAssetsWatcher.onDidDelete(onChange);
    this.disposables.push(this.codeAssetsWatcher);
  }

  readonly rootFolder: vscode.WorkspaceFolder;
  readonly workspaceIO: WorkspaceIO;

  readonly codeAssetsWatcher: vscode.FileSystemWatcher;
  private readonly _onDidChangeCodeAssets = new vscode.EventEmitter<string>();
  readonly onDidChangeCodeAssets = this._onDidChangeCodeAssets.event;

  getDataForProject(projectPath: string): ProjectData {
    return this.workspaceIO.getOrCreateProject(projectPath).project.data;
  }

  getDataForFile(uri: vscode.Uri): ProjectData {
    return this.getDataForProject(
      this.workspaceIO.projectPathForFile(uri.fsPath)
    );
  }

  pageIDForFile(uri: vscode.Uri): string {
    // Important TODO: fix paths in Windows!!
    const relativePath = path.relative(
      this.workspaceIO.projectPathForFile(uri.fsPath),
      uri.fsPath
    );
    return getPageID(relativePath.replace(/\.uimix$/, ""));
  }

  projectPathForFile(uri: vscode.Uri): string {
    return this.workspaceIO.projectPathForFile(uri.fsPath);
  }

  async save(uri: vscode.Uri) {
    const projectPath = this.workspaceIO.projectPathForFile(uri.fsPath);
    try {
      await this.workspaceIO.save(projectPath);
    } catch (e) {
      vscode.window.showErrorMessage(`Error saving project:\n${e}`);
    }
  }

  readonly disposables: vscode.Disposable[] = [];

  dispose() {
    for (const disposable of this.disposables) {
      disposable.dispose();
    }
  }
}
