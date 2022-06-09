import * as path from "path";
import * as fs from "fs";
import chokidar from "chokidar";
import glob from "glob";
import { Command } from "commander";
import slash from "slash";
import * as prettier from "prettier";
import { compile } from "./compiler";

function compileFile(filePath: string, outputDir?: string): void {
  const data = fs.readFileSync(filePath, "utf8");

  const outFileName = path.basename(filePath).replace(/\.macaron$/, ".js");
  const outFilePath = path.join(
    outputDir ?? path.dirname(filePath),
    outFileName
  );

  const out = compile(data);
  const formatted = prettier.format(out, {
    parser: "babel",
  });

  fs.writeFileSync(outFilePath, formatted);
}

function compileFiles(
  filePathOrGlobs: string[],
  options: {
    watch?: boolean;
    output?: string;
  }
): void {
  const filePaths = new Set(filePathOrGlobs.flatMap((f) => glob.sync(f)));

  if (options.watch) {
    const watcher = chokidar.watch(filePathOrGlobs);

    const onChangeAdd = (filePath: string) => {
      try {
        compileFile(filePath);
      } catch (e) {
        console.error(e);
      }
    };

    watcher.on("change", onChangeAdd);
    watcher.on("add", onChangeAdd);
  }

  for (const filePath of filePaths) {
    compileFile(filePath);
  }
}

const program = new Command("macaron");
program.version("0.0.1");

program
  .option("--watch", "Watch files for changes")
  .option("-o, --output <directory>", "Output directory")
  .argument("<files...>")
  .action((files: string[], options: { watch?: boolean; output?: string }) => {
    compileFiles(files.map(slash), options);
  });

program.parse(process.argv);
