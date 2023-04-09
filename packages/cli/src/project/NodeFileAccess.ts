import * as fs from "fs";
import * as path from "path";
import { FileAccess } from "./FileAccess";
import { glob } from "glob";
import chokidar from "chokidar";
import { mkdirp } from "mkdirp";

export class NodeFileAccess implements FileAccess {
  constructor(rootPath: string) {
    this.rootPath = rootPath;
  }

  readonly rootPath: string;

  watch(pattern: string, onChange: () => void): () => void {
    const watcher = chokidar.watch(path.resolve(this.rootPath, pattern), {
      ignored: ["**/node_modules/**", "**/.git/**"],
    });
    watcher.on("change", onChange);
    watcher.on("add", onChange);
    watcher.on("unlink", onChange);
    return () => watcher.close();
  }

  async glob(pattern: string): Promise<string[]> {
    return await glob(pattern, {
      cwd: this.rootPath,
    });
  }

  async writeText(filePath: string, data: string): Promise<void> {
    const fullPath = path.resolve(this.rootPath, filePath);

    await mkdirp(path.dirname(fullPath));
    await fs.promises.writeFile(fullPath, data);
  }

  async readText(filePath: string): Promise<string> {
    return await fs.promises.readFile(
      path.resolve(this.rootPath, filePath),
      "utf8"
    );
  }

  async remove(filePath: string): Promise<void> {
    await fs.promises.rm(path.resolve(this.rootPath, filePath));
  }
}
