import { cac } from "cac";
import { generateCode } from "./compiler/generateCode";
import * as fs from "fs";
import * as path from "path";
import chokidar from "chokidar";
import { globSync } from "glob";
import minimatch from "minimatch";
import { ProjectJSON } from "@uimix/node-data";

function compileFile(
  filePath: string,
  outDir: string = path.dirname(filePath)
) {
  const data = fs.readFileSync(filePath, "utf8");
  const json = ProjectJSON.parse(JSON.parse(data));

  const outFiles = generateCode(json, []);

  const outBaseName = path.basename(filePath, path.extname(filePath));

  for (const outFile of outFiles) {
    const outPath = path.join(outDir, outBaseName + outFile.suffix);
    fs.writeFileSync(outPath, outFile.content, "utf8");
  }
}

function compileCommand(
  filePathOrGlobs: string[],
  options: {
    watch?: boolean;
    output?: string;
  }
): void {
  const filePaths = new Set(filePathOrGlobs.flatMap((f) => globSync(f)));

  if (options.watch) {
    const watcher = chokidar.watch(filePathOrGlobs);

    const onChangeAdd = (filePath: string) => {
      try {
        if (filePathOrGlobs.some((p) => minimatch(filePath, p))) {
          compileFile(filePath);
        }
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

const cli = cac("uimix");

cli
  .command("compile [...files]", "compile UIMix files")
  .option("-w, --watch", `[boolean] watch for changes`)
  .option("-o, --output <outdir>", `[string] output directory`)
  .action(
    async (
      files: string[],
      options: {
        watch?: boolean;
        output?: string;
      }
    ) => {
      compileCommand(files, options);
    }
  );

cli.help();
cli.version("0.0.1");
cli.parse();
