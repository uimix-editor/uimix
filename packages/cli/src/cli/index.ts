import { cac } from "cac";
import { generateCode } from "../compiler/generateCode";
import * as fs from "fs";
import * as path from "path";
import mkdirp from "mkdirp";
import { ProjectIO } from "../project/ProjectIO";
import { NodeFileAccess } from "../project/NodeFileAccess";

async function compileProject(projectIO: ProjectIO) {
  const outFiles = await generateCode(
    projectIO.rootPath,
    projectIO.content.manifest,
    projectIO.content.project.toJSON(),
    projectIO.content.imagePaths
  );

  for (const outFile of outFiles) {
    const outPath = path.join(projectIO.rootPath, outFile.filePath);
    const outPathDir = path.dirname(outPath);
    mkdirp.sync(outPathDir);
    fs.writeFileSync(outPath, outFile.content);
  }
}

async function compileCommand(
  rootPath: string,
  options: {
    watch?: boolean;
  }
): Promise<void> {
  const projectIO = await ProjectIO.load(new NodeFileAccess(), rootPath);

  if (options.watch) {
    projectIO.watch(() => compileProject(projectIO));
  }

  //await buildCodeAssets(rootPath, projectIO.content.manifest, options);
  await compileProject(projectIO);
}

const cli = cac("uimix");

// TODO: output help if unknown command is passed

cli
  .command("compile", "compile UIMix project")
  .option("--root", `[string] root directory`)
  .option("-w, --watch", `[boolean] watch for changes`)
  .action(async (options: { root?: string; watch?: boolean }) => {
    await compileCommand(path.resolve(options.root || "."), options);
  });

cli.help();
cli.version("0.0.1");
cli.parse();
