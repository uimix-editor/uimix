import { cac } from "cac";
import { generateCode } from "./compiler/generateCode";
import * as fs from "fs";
import * as path from "path";
import chokidar from "chokidar";
import { globSync } from "glob";
import minimatch from "minimatch";
import { ProjectJSON } from "@uimix/node-data";
import mkdirp from "mkdirp";

function getPackageJSONDirname(filePath: string) {
  let dirPath = path.dirname(filePath);
  while (dirPath !== "/") {
    const packageJson = path.join(dirPath, "package.json");
    if (fs.existsSync(packageJson)) {
      return dirPath;
    }
    dirPath = path.dirname(dirPath);
  }
  return path.dirname(filePath);
}

async function compileFile(
  filePath: string,
  outDir: string = path.dirname(filePath)
) {
  const data = fs.readFileSync(filePath, "utf8");
  const json = ProjectJSON.parse(JSON.parse(data));

  const packageJSONDirname = getPackageJSONDirname(filePath);
  const modulePathPrefix = path.relative(outDir, packageJSONDirname);
  const outBaseName = path.basename(filePath, path.extname(filePath));
  const outFiles = await generateCode(modulePathPrefix, outBaseName, json);

  for (const outFile of outFiles) {
    const outPath = path.join(outDir, outFile.filePath);
    const outPathDir = path.dirname(outPath);
    mkdirp.sync(outPathDir);
    fs.writeFileSync(outPath, outFile.content);
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

    const onChangeAdd = async (filePath: string) => {
      try {
        if (filePathOrGlobs.some((p) => minimatch(filePath, p))) {
          await compileFile(filePath);
        }
      } catch (e) {
        console.error(e);
      }
    };

    watcher.on("change", onChangeAdd);
    watcher.on("add", onChangeAdd);
  }

  for (const filePath of filePaths) {
    void compileFile(filePath);
  }
}

const cli = cac("uimix");

// TODO: output help if unknown command is passed

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
