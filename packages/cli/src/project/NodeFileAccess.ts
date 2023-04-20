import * as fs from "fs";
import * as path from "path";
import { FileAccess, Stats } from "./FileAccess";
import { glob } from "glob";
import chokidar from "chokidar";
import { mkdirp } from "mkdirp";

export class NodeFileAccess implements FileAccess {
  constructor(rootPath: string) {
    this.rootPath = path.resolve(rootPath);
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
    return (
      await glob(pattern, {
        cwd: this.rootPath,
      })
    ).map((filePath) => path.resolve(this.rootPath, filePath));
  }

  async stat(filePath: string): Promise<Stats | undefined> {
    try {
      const stat = await fs.promises.stat(
        path.resolve(this.rootPath, filePath)
      );
      return {
        type: stat.isDirectory() ? "directory" : "file",
      };
    } catch (e) {
      return undefined;
    }
  }

  async writeFile(filePath: string, data: Buffer): Promise<void> {
    await mkdirp(path.dirname(filePath));
    await fs.promises.writeFile(filePath, data);
  }

  async readFile(filePath: string): Promise<Buffer> {
    return await fs.promises.readFile(filePath);
  }

  async remove(filePath: string): Promise<void> {
    await fs.promises.rm(path.resolve(this.rootPath, filePath));
  }
}
