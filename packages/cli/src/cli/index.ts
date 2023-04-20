import { cac } from "cac";
import { generateCode } from "../compiler/generateCode";
import * as fs from "fs";
import * as path from "path";
import mkdirp from "mkdirp";
import { WorkspaceLoader } from "../project/WorkspaceLoader";
import { NodeFileAccess } from "../project/NodeFileAccess";
import { buildCodeAssets } from "../codeAssets/build";

async function compileProject(loader: WorkspaceLoader) {
  const outFiles = await generateCode(
    loader.rootPath,
    loader.rootProject.manifest,
    loader.rootProject.project.toJSON()
  );

  for (const outFile of outFiles) {
    const outPath = path.join(loader.rootPath, outFile.filePath);
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
  const loader = await WorkspaceLoader.load(new NodeFileAccess(rootPath));

  if (options.watch) {
    loader.watch(() => compileProject(loader));
  }

  await buildCodeAssets(rootPath, loader.rootProject.manifest, options);
  await compileProject(loader);
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
