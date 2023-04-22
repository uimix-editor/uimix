import { cac } from "cac";
import { generateCode } from "../compiler/generateCode";
import * as fs from "fs";
import * as path from "path";
import mkdirp from "mkdirp";
import { WorkspaceIO } from "../project/WorkspaceIO";
import { NodeFileAccess } from "../project/NodeFileAccess";
import { buildCodeAssets } from "../codeAssets/build";

async function compileProject(workspaceIO: WorkspaceIO) {
  const outFiles = await generateCode(
    workspaceIO.rootPath,
    workspaceIO.rootProject.manifest,
    workspaceIO.rootProject.project.toJSON(),
    workspaceIO.rootProject.imagePaths
  );

  for (const outFile of outFiles) {
    const outPath = path.join(workspaceIO.rootPath, outFile.filePath);
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
  const workspaceIO = await WorkspaceIO.load(new NodeFileAccess(), rootPath);

  if (options.watch) {
    workspaceIO.watch(() => compileProject(workspaceIO));
  }

  await buildCodeAssets(rootPath, workspaceIO.rootProject.manifest, options);
  await compileProject(workspaceIO);
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
