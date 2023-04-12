import * as vscode from "vscode";
import { WorkspaceLoader } from "uimix/src/project/WorkspaceLoader";
import { FileAccess } from "uimix/src/project/FileAccess";
import { ProjectData } from "@uimix/model/src/collaborative";
import debounce from "just-debounce-it";
import * as path from "path";
import { getPageID } from "@uimix/model/src/data/util";

let lastSaveTime = 0;

class VSCodeFileAccess implements FileAccess {
  constructor(rootFolder: vscode.WorkspaceFolder) {
    this.rootFolder = rootFolder;
  }

  readonly rootFolder: vscode.WorkspaceFolder;

  get rootPath() {
    return this.rootFolder.uri.fsPath;
  }

  watch(pattern: string, onChange: () => void): () => void {
    const watcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(this.rootFolder, pattern)
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

  async glob(pattern: string): Promise<string[]> {
    const urls = await vscode.workspace.findFiles(
      new vscode.RelativePattern(this.rootFolder, pattern),
      // TODO: configure excludes
      "**/node_modules/**"
    );
    return urls.map((url) => url.fsPath);
  }

  async writeText(filePath: string, data: string): Promise<void> {
    lastSaveTime = Date.now();

    await vscode.workspace.fs.writeFile(
      vscode.Uri.file(filePath),
      Buffer.from(data)
    );
  }

  async readText(filePath: string): Promise<string> {
    const url = vscode.Uri.file(filePath);
    const buffer = await vscode.workspace.fs.readFile(url);
    const text = buffer.toString();
    return text;
  }

  async remove(filePath: string): Promise<void> {
    // no-op for now (vscode extension doesn't need to delete files)
  }
}

export class WorkspaceData {
  static async load(rootFolder: vscode.WorkspaceFolder) {
    const loader = new WorkspaceLoader(new VSCodeFileAccess(rootFolder));
    await loader.load();
    return new WorkspaceData(loader);
  }

  constructor(loader: WorkspaceLoader) {
    this.loader = loader;
    this.updateData();
    this.disposables.push({
      dispose: this.loader.watch(() => {
        console.log("reload");
        this.updateData();
      }),
    });
  }

  readonly loader: WorkspaceLoader;

  private readonly dataForProject = new Map<string /* path */, ProjectData>();

  getDataForProject(projectPath: string): ProjectData {
    let data = this.dataForProject.get(projectPath);
    if (!data) {
      data = new ProjectData();
      this.dataForProject.set(projectPath, data);
    }
    return data;
  }

  getDataForFile(uri: vscode.Uri): ProjectData {
    return this.getDataForProject(this.loader.projectPathForFile(uri.fsPath));
  }

  pageIDForFile(uri: vscode.Uri): string {
    // Important TODO: fix paths in Windows!!
    const relativePath = path.relative(
      this.loader.projectPathForFile(uri.fsPath),
      uri.fsPath
    );
    return getPageID(relativePath.replace(/\.uimix$/, ""));
  }

  private updateData() {
    for (const [projectPath, json] of this.loader.jsons) {
      this.getDataForProject(projectPath).loadJSON(json);
    }
  }

  save(uri: vscode.Uri) {
    for (const projectPath of [...this.loader.jsons.keys()]) {
      this.loader.jsons.set(
        projectPath,
        this.getDataForProject(projectPath).toJSON()
      );
    }
    this.loader.save([uri.fsPath]);
  }

  readonly disposables: vscode.Disposable[] = [];

  dispose() {
    for (const disposable of this.disposables) {
      disposable.dispose();
    }
  }
}
