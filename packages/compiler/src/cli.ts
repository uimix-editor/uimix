import chokidar from "chokidar";
import glob from "glob";
import { Command } from "commander";
import { FilesCompiler } from "./compiler/FilesCompiler";

function compileFiles(
  filePathOrGlobs: string[],
  options: {
    commonjs?: boolean;
    watch?: boolean;
  }
): void {
  const filePaths = new Set(filePathOrGlobs.flatMap((f) => glob.sync(f)));

  if (options.watch) {
    const watcher = chokidar.watch(filePathOrGlobs);

    const onChangeAdd = (filePath: string) => {
      try {
        filePaths.add(filePath);
        new FilesCompiler([...filePaths], options).compile();
        console.log(`Compiled ${filePath}`);
      } catch (e) {
        console.error(e);
      }
    };

    watcher.on("change", onChangeAdd);
    watcher.on("add", onChangeAdd);
  }

  new FilesCompiler([...filePaths], options).compile();
}

const program = new Command("macaron");
program.version("0.0.1");

program
  .command("compile")
  .option("--commonjs", "Emit CommonJS modules instead of ES modules")
  .option("--watch", "Watch files for changes")
  .argument("<files...>")
  .action(
    (files: string[], options: { commonjs?: boolean; watch?: boolean }) => {
      compileFiles(files, options);
    }
  );

program.parse(process.argv);
