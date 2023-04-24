import * as fs from "fs";
import * as path from "path";
import { FileAccess, Stats } from "./FileAccess";
import chokidar from "chokidar";
import { mkdirp } from "mkdirp";
import { globby } from "globby";

export class NodeFileAccess implements FileAccess {
  watch(cwd: string, patterns: string[], onChange: () => void): () => void {
    const watcher = chokidar.watch(`**/{${patterns.join(",")},}`, {
      cwd,
      ignored: ["**/node_modules/**", "**/.git/**"],
    });
    watcher.on("change", onChange);
    watcher.on("add", onChange);
    watcher.on("unlink", onChange);
    return () => watcher.close();
  }

  async glob(cwd: string, patterns: string[]): Promise<string[]> {
    return (
      await globby(`**/{${patterns.join(",")},}`, {
        cwd,
        ignore: ["**/node_modules/**", "**/.git/**"],
      })
    ).map((filePath) => path.resolve(cwd, filePath));
  }

  async stat(filePath: string): Promise<Stats | undefined> {
    try {
      const stat = await fs.promises.stat(filePath);
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
    await fs.promises.rm(filePath);
  }
}
