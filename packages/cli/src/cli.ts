import { cac } from "cac";
import { generateCode } from "./compiler/generateCode";
import * as fs from "fs";
import * as path from "path";
import mkdirp from "mkdirp";
import { ProjectFiles } from "./project/ProjectFiles";

async function compileProject(projectFiles: ProjectFiles) {
  const outFiles = await generateCode(projectFiles.rootPath, projectFiles.json);

  for (const outFile of outFiles) {
    const outPath = path.join(projectFiles.rootPath, outFile.filePath);
    const outPathDir = path.dirname(outPath);
    mkdirp.sync(outPathDir);
    fs.writeFileSync(outPath, outFile.content);
  }
}

function compileCommand(
  rootPath: string,
  options: {
    watch?: boolean;
  }
): void {
  const projectFiles = ProjectFiles.load(rootPath);

  if (options.watch) {
    projectFiles.watch(() => compileProject(projectFiles));
  }

  void compileProject(projectFiles);
}

const cli = cac("uimix");

// TODO: output help if unknown command is passed

cli
  .command("compile", "compile UIMix project")
  .option("--root", `[string] root directory`)
  .option("-w, --watch", `[boolean] watch for changes`)
  .action(async (options: { root?: string; watch?: boolean }) => {
    compileCommand(path.resolve(options.root || "."), options);
  });

cli.help();
cli.version("0.0.1");
cli.parse();
