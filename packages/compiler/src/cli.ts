import chokidar from "chokidar";
import glob from "glob";
import { Command } from "commander";
import { compileFile } from "./compiler";

function compileFiles(
  filePathOrGlobs: string[],
  options: {
    watch?: boolean;
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
  .argument("<files...>")
  .action((files: string[], options: { watch?: boolean }) => {
    compileFiles(files, options);
  });

program.parse(process.argv);
